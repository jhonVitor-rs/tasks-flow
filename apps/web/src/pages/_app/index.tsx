import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/")({ component: AppIndex });

function AppIndex() {
  return <div>Index</div>;
}
