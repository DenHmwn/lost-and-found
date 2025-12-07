"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/axios";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ApiError {
  response: {
    data: {
      message: string;
    };
  };
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post("/auth/login", { email, password });

      if (data.success) {
        // Simpan token di localStorage (untuk Bearer token)
        localStorage.setItem("accessToken", data.accessToken);

        // Redirect ke dashboard
        router.push("/homepage/user/dashboard");
      }
    } catch (err: unknown) {
      const error = err as ApiError;
      setError(error.response?.data?.message || "Login gagal");
    } finally {
      setIsLoading(true);
    }
  };

  return (
    <section className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Masukan alamat email anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <FieldGroup>
              {/* Error Message */}
              {error && (
                <div className="p-3 mb-4 text-sm text-red-800 bg-red-100 rounded-lg">
                  {error}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  placeholder="deni@example.com"
                  required
                />
              </Field>
              <Field>
                <section className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Lupa Password?
                  </Link>
                </section>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="***********"
                />
              </Field>
              <Field>
                <Button type="submit" className="w-full" disabled={isLoading}>Login
                  {/* {isLoading ? "Loading..." : "Login"} */}
                </Button>
                <Button variant="outline" type="button">
                  Login with Google
                </Button>
              </Field>
              <section className="text-center text-sm">
                Belum punya akun?
                <Link
                  href="/signup" 
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Daftar
                </Link>
              </section>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
