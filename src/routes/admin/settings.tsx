import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Settings, Loader2, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { useChangePassword } from '../../features/admin/api/index';
import { changePasswordSchema } from '../../features/admin/types/index';
import type { ChangePasswordData } from '../../features/admin/types/index';

export const Route = createFileRoute('/admin/settings')({
  component: AdminSettings,
});

function AdminSettings() {
  const changePassword = useChangePassword();
  const form = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = (data: ChangePasswordData) => {
    changePassword.mutate(data, {
      onSuccess: () => form.reset(),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Account and security settings</p>
      </div>

      <Card className="max-w-lg border-border/40 bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="h-4 w-4 text-blue-500" />
            Change Password
          </CardTitle>
          <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="currentPassword" render={({ field }) => (
                <FormItem><FormLabel>Current Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="newPassword" render={({ field }) => (
                <FormItem><FormLabel>New Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                <FormItem><FormLabel>Confirm New Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" disabled={changePassword.isPending} className="gap-2">
                {changePassword.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Settings className="h-4 w-4" />}
                Update Password
              </Button>
              {changePassword.isSuccess && (
                <p className="text-sm text-emerald-600">Password updated successfully!</p>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
