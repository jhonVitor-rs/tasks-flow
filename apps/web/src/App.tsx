import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./route-tree.gen";
import { QueryProvider } from "./utils/query-client";
import { Toaster } from "./components/ui/sonner";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />;
      <Toaster />
    </QueryProvider>
  );
}
