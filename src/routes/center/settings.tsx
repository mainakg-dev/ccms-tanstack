import { Button } from "#/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { useChangePassword } from "#/features/admin/api";
import {
  changePasswordSchema,
  type ChangePasswordData,
} from "#/features/admin/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Lock, Settings } from "lucide-react";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/center/settings")({
  component: CenterSettings,
});

function CenterSettings() {
  const changePassword = useChangePassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ChangePasswordData) => {
    changePassword.mutate(data, { onSuccess: () => reset() });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Center account settings</p>
      </div>
      <Card className="max-w-lg border-border/40 bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="h-4 w-4 text-blue-500" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your center account password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="currentPassword" className="text-sm font-medium leading-none select-none">
                Current Password
              </label>
              <Input
                id="currentPassword"
                type="password"
                {...register("currentPassword")}
              />
              {errors.currentPassword && (
                <p className="text-xs font-medium text-destructive">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <label htmlFor="newPassword" className="text-sm font-medium leading-none select-none">
                New Password
              </label>
              <Input
                id="newPassword"
                type="password"
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <p className="text-xs font-medium text-destructive">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium leading-none select-none">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-xs font-medium text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={changePassword.isPending}
              className="gap-2"
            >
              {changePassword.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Settings className="h-4 w-4" />
              )}
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
