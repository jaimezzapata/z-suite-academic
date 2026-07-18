"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";

type SignOutButtonProps = {
  className?: string;
  compact?: boolean;
};

export function SignOutButton({
  className,
  compact = false,
}: SignOutButtonProps) {
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };

  return (
    <Button
      aria-label="Cerrar sesion"
      className={cn("gap-2", compact && "h-10 w-10 px-0", className)}
      onClick={handleSignOut}
      type="button"
      variant="secondary"
    >
      <LogOut className="h-4 w-4" />
      {compact ? null : "Cerrar sesion"}
    </Button>
  );
}
