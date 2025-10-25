import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useLogin } from "../hooks/use-login";
import { useSessionActions } from "../stores/session";
import { toast } from "sonner";
import { setToken } from "../utils/auth";
import { useRouter } from "@tanstack/react-router";

const formSchema = z.object({
  email: z.string().min(10).max(100).includes("@"),
  password: z.string().min(8).max(20),
});

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();
  const { setUser, logout } = useSessionActions();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    loginMutation.mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: (data) => {
          setUser({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
          });
          setToken(data.accessToken);
          toast.success("Login sucessful");
          router.navigate({ to: "/tasks" });
        },
        onError: (error) => {
          console.log(error);
          logout();
          toast.error("Autentication Failed");
        },
      }
    );
  });

  return (
    <Card className="w-full shadow shadow-primary">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Use your registration data</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormDescription>
                    Use your registered email address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormDescription>
                    Use the password you registered
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit">Login</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
