"use client";
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
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    notelp: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(form);
    setError(null);
    setSuccess(null);

    // validasi FE
    if (form.password !== form.confirmPassword) {
      setError("Password dan konfirmasi password tidak sama");
      return;
    }

    if (form.password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        notelp: form.notelp,
        // role tidak dikirim karena default USER dari BE
      });

      if (!res.data.success) {
        setError(res.data.message);
        return;
      }

      setSuccess("Registrasi berhasil, silakan login");
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        notelp: "",
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Registrasi gagal");
        return;
      }
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Buat Akun</CardTitle>
        <CardDescription>
          Masukkan informasi Anda di bawah ini untuk membuat akun Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                required
                placeholder="Deni Himawan"
                value={form.name}
                onChange={handleChange}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                required
                placeholder="denihmwn@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="notelp">No. Telepon</FieldLabel>
              <Input
                id="notelp"
                type="tel"
                required
                placeholder="081234567890"
                value={form.notelp}
                onChange={handleChange}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                required
                placeholder="**************"
                value={form.password}
                onChange={handleChange}
              />
              <FieldDescription>
                Panjangnya minimal 6 karakter.{" "}
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                required
                placeholder="**************"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              <FieldDescription>
                Harap konfirmasi kata sandi Anda.
              </FieldDescription>
            </Field>
            {error && (
              <FieldDescription className="text-red-500">
                {error}
              </FieldDescription>
            )}
            {success && (
              <FieldDescription className="text-green-500">
                {success}
              </FieldDescription>
            )}
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={loading}>
                  {/* {loading? "Loading..." : "Buat Akun"} */}
                  Buat Akun
                </Button>
                <Button variant="outline" type="button">
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Sudah punya akun? <Link href="/login">Masuk</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
