import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { Button } from "../../../components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { LoginForm } from "../../../components/login-form";
import { RegisterForm } from "../../../components/register-form";
import { useSessionAuthenticated } from "../../../stores/session";
import { useEffect } from "react";

export const Route = createFileRoute("/_app/auth/")({
  beforeLoad: () => {
    const hasToken = document.cookie.includes("refresh_token");
    if (hasToken) {
      throw redirect({ to: "/tasks" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const isAuthenticated = useSessionAuthenticated();

  useEffect(() => {
    if (isAuthenticated) {
      router.navigate({ to: "/tasks" });
    }
  }, [isAuthenticated, router]);

  return (
    <div className="bg-muted min-h-screen p-2 md:p-4">
      <div className="flex w-full md:px-4 py-2 mb-2">
        <Link to="/">
          <Button
            variant={"ghost"}
            className="cursor-pointer hover:shadow-sm shadow-primary/80 text-primary hover:text-primary"
          >
            <ArrowLeft /> Voltar
          </Button>
        </Link>
      </div>
      <div className="m-auto w-full max-w-lg">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 w-full bg-primary">
            <TabsTrigger
              value="login"
              className="text-primary-foreground data-[state=active]:text-primary"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="text-primary-foreground data-[state=active]:text-primary"
            >
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
