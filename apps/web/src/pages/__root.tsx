import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  console.log("Root");
  return (
    <div>
      <Outlet />
    </div>
  );
}
