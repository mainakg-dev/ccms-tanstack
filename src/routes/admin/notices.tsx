import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bell, Loader2, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { useCreateNotice } from '../../features/admin/api/index';
import { noticeSchema } from '../../features/admin/types/index';
import type { NoticeFormData } from '../../features/admin/types/index';

export const Route = createFileRoute('/admin/notices')({
  component: AdminNotices,
});

function AdminNotices() {
  const createNotice = useCreateNotice();
  const form = useForm<NoticeFormData>({
    resolver: zodResolver(noticeSchema),
    defaultValues: { title: '', content: '' },
  });

  const onSubmit = (data: NoticeFormData) => {
    createNotice.mutate(data, {
      onSuccess: () => form.reset(),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notice Board</h1>
        <p className="text-sm text-muted-foreground">Create and publish notices for all centers</p>
      </div>

      <Card className="border-border/40 bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4 text-amber-500" />
            Create Notice
          </CardTitle>
          <CardDescription>Publish a notice visible to all centers and students.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="Notice title" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="content" render={({ field }) => (
                <FormItem><FormLabel>Content</FormLabel><FormControl><Textarea placeholder="Write notice content here..." rows={6} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" disabled={createNotice.isPending} className="gap-2">
                {createNotice.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Publish Notice
              </Button>
              {createNotice.isSuccess && (
                <p className="text-sm text-emerald-600">Notice published successfully!</p>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
