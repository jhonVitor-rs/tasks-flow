import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/tasks/$taskId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/tasks/$taskId"!</div>
}
