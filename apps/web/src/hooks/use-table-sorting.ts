import type { SortingState } from "@tanstack/react-table";
import { useTaskQuery, useTasksActions } from "../stores/tasks";
import { useEffect } from "react";
import { mapColumnIdToOrderBy } from "../constants/tasks-order";

export function useTableSorting(sorting: SortingState) {
  const { updateSort } = useTasksActions()
  const query = useTaskQuery()

  useEffect(() => {
    if (sorting.length === 0) {
      if (query.orderBy || query.order) {
        updateSort(undefined, undefined)
      }
      return
    }

    const sort = sorting[0]
    const orderBy = mapColumnIdToOrderBy(sort.id)
    const order = sort.desc ? 'DESC' : 'ASC'

    if (query.orderBy !== orderBy || query.order !== order) {
      updateSort(orderBy, order)
    }
  }, [sorting, query.orderBy, query.order, updateSort]);
}
