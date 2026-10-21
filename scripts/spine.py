#!/usr/bin/env python3
"""Replay every spine step and compare its terminal transcript with what the code really prints.

The spine is the course's one project, `retail-pipeline`, kept as real files: one snapshot per step in
spine/<course>/<step>/project/. Each step's session.txt is the terminal pane a scene shows — `$ `
lines are commands, everything else is their output. Scenes import these files with Vite's `?raw`,
so a frame can only show what this script has verified.

  python3 scripts/spine.py            check every step (exit 1 on any difference)
  python3 scripts/spine.py --write    re-run every step and rewrite its session.txt / captures
  python3 scripts/spine.py hold/03    only the steps whose path starts with an argument

Each step is replayed in a fresh temp copy named retail-pipeline, inside a temp "home" directory, by
ONE bash process, so `cd` and `source .venv/bin/activate` carry from command to command as they do
in a real terminal. A `$ python` or `$ pyspark` command (with any variables or flags) followed by
`>>> ` lines is a REPL session: it is run in a pseudo-terminal and fed those lines. Temp paths are
rewritten to /home/ana/retail-pipeline, the path the frames show. Run it with the course's pinned
interpreter first on PATH as `python`, and Java 17 or 21 as `java` (see CLAUDE.md). Run one replay
at a time: a second Spark on the machine takes port 4040 and every frame that prints it changes.

Spark-specific, and all of it about the MACHINE, never the code:
  - PySpark 4.0.1 is installed ONCE into a cached base environment (.spine-cache/<name>/, from
    spine/<name>.txt, default requirements.txt); a step's fresh .venv sees it through a .pth file, so
    `pip list` and `import pyspark` behave as they do after a real `pip install`, without a 400 MB
    install per step. A session that types `pip install` itself still runs it for real.
  - JAVA_TOOL_OPTIONS is removed (this container's proxy settings would print a `Picked up` line),
    SPARK_LOCAL_IP is pinned to 127.0.0.1 (no hostname warning), and TZ is UTC, so a timestamp shown
    is the same on every machine. The quiet logs are the PROJECT's own conf/log4j2.properties.

step.json (all keys optional):
  {"start": "home"}             start in the directory ABOVE the project (default: the project)
  {"venv": true}                create .venv before replaying and start with it activated
  {"capture": ["path", ...]}    files the session creates that a scene shows; saved to captured/
  {"project": "name"}           the folder's name (default retail-pipeline): Course 1-2 demos are not the spine
  {"requirements": "name"}      the base environment: spine/<name>.txt (default requirements, PySpark alone)
  {"volatile": true}            output carries ids or timings that change every run: compared with every
                                digit masked, so the text and shape are checked but not the numbers
"""
import json
import os
import pty
import re
import select
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / 'spine'
SHOWN_HOME = '/home/ana'
PROJECT = 'retail-pipeline'
CACHE = Path(__file__).resolve().parent.parent / '.spine-cache'
ANSI = re.compile(r'\x1b\[[0-9;?]*[@-~]|\x1b[=>]|\r')
MARK = '__SPINE_MARK__'
UUID = re.compile(r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')
# The terminal pane's width in characters (src/scenes/ide.ts): output is wrapped there, as a real
# terminal of that width wraps it, and COLUMNS tells the tools that do their own layout.
COLUMNS = 84


def commands(session: str) -> list[tuple[str, list[str]]]:
    """Split a transcript into (command, REPL input lines) pairs."""
    out: list[tuple[str, list[str]]] = []
    for line in session.splitlines():
        if line.startswith('$ '):
            out.append((line[2:], []))
        elif out and {'python', 'pyspark'} & set(out[-1][0].split()) and (line.startswith('>>> ') or line == '>>>' or line.startswith('... ')):
            out[-1][1].append(line[4:])
    return out


def repl(cwd: Path, env: dict, command: str, inputs: list[str]) -> str:
    """Run `python` or `pyspark` in a pty, type each input line, and return the screen text."""
    pid, fd = pty.fork()
    if pid == 0:
        os.chdir(cwd)
        # through bash, so a command may set a variable for itself: `SPARK_CONF_DIR=conf python -q`
        os.execvpe('bash', ['bash', '-c', f'exec env {command}'], {**env, 'TERM': 'xterm-256color'})
    screen = b''
    closed = False

    def drain(timeout: float) -> None:
        nonlocal screen, closed
        end = time.time() + timeout
        while time.time() < end:
            ready, _, _ = select.select([fd], [], [], 0.05)
            if ready:
                try:
                    chunk = os.read(fd, 4096)
                except OSError:
                    closed = True
                    return
                if not chunk:
                    closed = True
                    return
                screen += chunk
                end = time.time() + 0.3

    def prompt(timeout: float) -> None:
        # pyspark starts a JVM before its first prompt, and an action can run for seconds: wait for
        # the next `>>> ` / `... ` rather than a fixed time, then let the screen settle.
        end = time.time() + timeout
        while time.time() < end and not closed:
            drain(0.5)
            tail = ANSI.sub('', screen.decode(errors='replace')).rstrip(' ')
            if tail.endswith('>>>') or tail.endswith('...'):
                return

    prompt(90)
    for line in inputs:
        os.write(fd, line.encode() + b'\r')
        prompt(90)
    for _ in range(300):
        if os.waitpid(pid, os.WNOHANG)[0]:
            break
        time.sleep(0.1)
    else:
        os.kill(pid, 9)
        os.waitpid(pid, 0)
        screen += b'\n[the REPL did not exit: check the >>> lines in session.txt]'
    text = ANSI.sub('', screen.decode(errors='replace'))
    return '\n'.join(l.rstrip() for l in text.split('\n')).strip('\n')


def base_env(name: str) -> Path:
    """The cached environment a step's .venv borrows PySpark from (built once per requirements file)."""
    requirements = ROOT / f'{name}.txt'
    stamp = CACHE / name / 'requirements.txt'
    site = CACHE / name / 'site'
    if not stamp.exists() or stamp.read_text() != requirements.read_text():
        shutil.rmtree(CACHE / name, ignore_errors=True)
        (CACHE / name).mkdir(parents=True)
        subprocess.run(['python', '-m', 'pip', 'install', '-q', '--disable-pip-version-check', '--target', str(site),
                        '-r', str(requirements)], check=True)
        shutil.copy(requirements, stamp)
    return site


def machine_env(home: Path) -> dict:
    env = {**os.environ, 'HOME': str(home), 'NO_COLOR': '1', 'PYTHON_COLORS': '0', 'TERM': 'dumb', 'PS1': '',
           'SPARK_LOCAL_IP': '127.0.0.1', 'TZ': 'UTC', 'PIP_DISABLE_PIP_VERSION_CHECK': '1',
           'PIP_CACHE_DIR': str(CACHE / '.pip'), 'COLUMNS': str(COLUMNS)}
    for key in ('JAVA_TOOL_OPTIONS', 'SPARK_HOME', 'PYSPARK_PYTHON', 'PYSPARK_DRIVER_PYTHON', 'VIRTUAL_ENV', 'PYTHONPATH'):
        env.pop(key, None)
    return env


def replay(step: Path) -> tuple[str, dict[str, str]]:
    config = json.loads((step / 'step.json').read_text()) if (step / 'step.json').exists() else {}
    session = (step / 'session.txt').read_text()
    with tempfile.TemporaryDirectory() as tmp:
        home = Path(tmp) / 'home'
        project = home / config.get('project', PROJECT)
        home.mkdir()
        if (step / 'project').exists():
            shutil.copytree(step / 'project', project)
        env = machine_env(home)
        if config.get('venv'):
            project.mkdir(exist_ok=True)
            subprocess.run(['python', '-m', 'venv', '.venv'], cwd=project, env=env, check=True)
            site = next((project / '.venv' / 'lib').glob('python3*/site-packages'))
            base = base_env(config.get('requirements', 'requirements'))
            (site / '_spine_base.pth').write_text(str(base) + '\n')
            # the scripts a real install puts in .venv/bin (pyspark, spark-submit, …): shell scripts
            # that find Spark through `python3`, which is now this venv's
            for script in (base / 'bin').glob('*') if (base / 'bin').exists() else []:
                target = project / '.venv' / 'bin' / script.name
                if script.is_file() and not target.exists():
                    shutil.copy(script, target)
            env['PATH'] = f"{project / '.venv' / 'bin'}:{env['PATH']}"
            env['VIRTUAL_ENV'] = str(project / '.venv')
        cwd = home if config.get('start') == 'home' else project
        blocks: list[str] = []
        for cmd, inputs in commands(session):
            if inputs:
                output = repl(cwd, env, cmd, inputs)
            else:
                script = f'cd {cwd!s}\n{{ {cmd}\n}} 2>&1\necho "{MARK}$PWD"\n'
                state = home / '.spine-state'
                if state.exists():
                    script = state.read_text() + script
                r = subprocess.run(['bash', '-c', script + f'declare -p VIRTUAL_ENV PATH 2>/dev/null > {state}'],
                                   env=env, capture_output=True, text=True)
                text = r.stdout
                output, _, after = text.partition(MARK)
                if after:
                    cwd = Path(after.split('\n')[0])
                output = output.rstrip('\n')
                if state.exists():
                    saved = state.read_text()
                    state.write_text(saved.replace('declare -x', 'export').replace('declare --', 'export') + '\n')
            blocks.append(f'$ {cmd}' + (f'\n{output}' if output else ''))
        transcript = '\n'.join(blocks)
        captured = {name: (project / name).read_text() for name in config.get('capture', [])}
    real = str(home)
    # The borrowed PySpark lives in .spine-cache/site; a learner's lives in their .venv, so a traceback
    # frame inside PySpark is shown at the path it has on their machine.
    venv_site = f"{SHOWN_HOME}/{config.get('project', PROJECT)}/.venv/lib/python{sys.version_info.major}.{sys.version_info.minor}/site-packages"
    borrowed = str(CACHE / config.get('requirements', 'requirements') / 'site')
    fix = lambda s: (s.replace(borrowed, venv_site).replace(real, SHOWN_HOME)
                     .replace(str(Path(tmp).resolve() / 'home'), SHOWN_HOME))
    return wrap(fix(transcript)).rstrip('\n') + '\n', {k: fix(v) for k, v in captured.items()}


def wrap(text: str) -> str:
    """Hard-wrap at the terminal pane's width, as a real terminal of that width does."""
    out = []
    for line in text.split('\n'):
        while len(line) > COLUMNS:
            out.append(line[:COLUMNS])
            line = line[COLUMNS:]
        out.append(line)
    return '\n'.join(out)


def masked(text: str, step: Path) -> str:
    """For a volatile step, hide the numbers that legitimately change from run to run."""
    config = json.loads((step / 'step.json').read_text()) if (step / 'step.json').exists() else {}
    # Spark names every file it writes part-NNNNN-<random uuid>: the name changes on every run, the
    # rest of the line does not, so a UUID is compared as a UUID, in every step
    text = UUID.sub('<uuid>', text)
    return re.sub(r'\d+', '#', text) if config.get('volatile') else text


def main() -> int:
    write = '--write' in sys.argv
    only = [a for a in sys.argv[1:] if not a.startswith('--')]
    steps = sorted(p.parent for p in ROOT.glob('*/*/session.txt'))
    steps = [s for s in steps if not only or any(str(s.relative_to(ROOT)).startswith(o) for o in only)]
    problems = 0
    for step in steps:
        transcript, captured = replay(step)
        name = step.relative_to(ROOT)
        if write:
            (step / 'session.txt').write_text(transcript)
            for file, text in captured.items():
                target = step / 'captured' / file
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text(text)
            print(f'wrote {name}')
            continue
        expected = (step / 'session.txt').read_text()
        if masked(transcript, step) != masked(expected, step):
            problems += 1
            print(f'✗ {name}: the terminal pane differs from a real run')
            import difflib
            sys.stdout.writelines(difflib.unified_diff(expected.splitlines(True), transcript.splitlines(True), 'session.txt', 'real run'))
        for file, text in captured.items():
            if masked((step / 'captured' / file).read_text(), step) != masked(text, step):
                problems += 1
                print(f'✗ {name}: captured/{file} differs from a real run')
    if not write:
        print(f"{'✗' if problems else '✓'} {len(steps)} spine step(s) replayed, {problems} difference(s)")
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main())
