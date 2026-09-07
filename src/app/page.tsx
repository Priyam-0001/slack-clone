"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { UserButton } from "@/features/auth/components/user-button";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      Logged in!
      <UserButton />
    </div>
  )
}