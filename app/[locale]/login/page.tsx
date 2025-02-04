"use client";

import { useForm } from "react-hook-form";
import { login } from "./actions";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/auth-js";
import { PasswordInput } from "@/components/ui/password-input";

const loginSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(1),
});

export default function LoginPage() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const { email, password } = values;
    const error = await login(email, password);
    if (error) {
      toast({
        title: "Bir sorun oluştu!",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Giriş</CardTitle>
          <CardDescription>
            Sisteme ulaşmak için giriş yapmanız gerekmektedir.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="flex flex-col space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@example.com" {...field} />
                    </FormControl>
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
                      <PasswordInput placeholder="Şifre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button isLoading={form.formState.isSubmitting} type="submit">
                Giriş
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
