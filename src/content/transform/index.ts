import type { Course } from '../types'
import { columnsAndExpressions } from './01-columns-and-expressions'
import { builtInFunctions } from './02-built-in-functions'
import { filterAndSelect } from './03-filter-and-select'
import { groupAndAggregate } from './04-group-and-aggregate'
import { joiningTheStores } from './05-joining-the-stores'
import { sparkSqlAndViews } from './06-spark-sql-and-temporary-views'
import { tablesAndTheCatalog } from './07-tables-and-the-catalog'

export const transform: Course = {
  id: 'transform',
  title: 'Transform it',
  sections: [columnsAndExpressions, builtInFunctions, filterAndSelect, groupAndAggregate, joiningTheStores, sparkSqlAndViews, tablesAndTheCatalog],
}
