import type { Scene } from '@graphlearning/flow'
import { columnsExpressions } from './columns'
import { builtInFunctions } from './functions'
import { filterSelect } from './filter'
import { groupAggregate } from './aggregate'
import { joiningStores } from './join'
import { sparkSql } from './sql'
import { tablesCatalog } from './tables'

export const transformScenes: Scene[] = [columnsExpressions, builtInFunctions, filterSelect, groupAggregate, joiningStores, sparkSql, tablesCatalog]
