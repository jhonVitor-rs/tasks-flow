import { createFileRoute, Link } from "@tanstack/react-router";
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
import { useSimpleMiddleware } from "../../../hooks/use-simple-middleware";

export const Route = createFileRoute("/_app/auth/")({
  component: RouteComponent,
});

function RouteComponent() {
  useSimpleMiddleware();

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
