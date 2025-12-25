"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/lib/axios";

// buat redirect
const roleRedirectLost: Record<string, string> = {
  ADMIN: "/homepage/admin/lost",
  USER: "/homepage/user/lost",
};
const roleRedirectFound: Record<string, string> = {
  ADMIN: "/homepage/admin/found",
  USER: "/homepage/user/found",
};

interface CustomButtonActionProps {
  label: string;
  className?: string;
}

export function CustomButtonListLost({
  label,
  className,
}: CustomButtonActionProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      // get user info dari header
      const response = await api.get("/user/me");

      // get role
      const Role = response.data?.data?.role;

      // console.log("role:", userRole);

      // redirect based on role
      const destination = roleRedirectLost[Role];

      // console.log("Redirecting to:", destination);

      router.push(destination);
    } catch (error) {
      // console.log("error:", error);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "h-15 px-8 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 shadow-md hover:shadow-2xl",
        className
      )}
    >
      {isLoading ? "Memuat..." : label}
    </Button>
  );
}

