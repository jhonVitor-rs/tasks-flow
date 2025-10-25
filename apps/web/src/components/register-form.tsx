import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
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
import { useRegister } from "../hooks/use-register";
import { useSessionActions } from "../stores/session";
import { setToken } from "../utils/auth";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";

const formSchema = z.object({
  name: z.string().min(5).max(50),
  email: z.string().min(10).max(100).includes("@"),
  password: z.string().min(8).max(20),
});

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();
  const { setUser, logout } = useSessionActions();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    registerMutation.mutate(
      { name: data.name, email: data.email, password: data.password },
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
        onError: () => {
          logout();
          toast.error("Autentication Failed");
        },
      }
    );
  });

  return (
    <Card className="w-full shadow shadow-primary">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>Register to start playing</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Use your name to register</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    Enter your email to register
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
                  <FormDescription>Create a password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="justify-end">
            <Button>Register</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
