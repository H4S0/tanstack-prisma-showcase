'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import z from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePrismaMutation } from '@/app/hooks/use-prisma-query';
import { QueryKey } from '@tanstack/react-query';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';

const CreatePostSchema = z.object({
  title: z.string(),
  content: z.string(),
});

const CreatePostForm = ({ queryKey }: { queryKey: QueryKey }) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof CreatePostSchema>>({
    resolver: zodResolver(CreatePostSchema),
  });

  const createPost = usePrismaMutation({
    model: 'post',
    operation: 'create',
    queryKey,
  });

  const onSubmit: SubmitHandler<z.infer<typeof CreatePostSchema>> = (data) => {
    createPost.mutate(
      { data },
      {
        onSuccess: (response) => {
          toast.success('Post created successfully!');
          setIsOpen(false);
          form.reset({
            title: '',
            content: '',
          });
        },
        onError: (error) => {
          toast.error(`Error creating post: ${error.message}`);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create post</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create post form</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post title</FormLabel>
                  <FormControl>
                    <Input placeholder="Programmers day" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post content</FormLabel>
                  <FormControl>
                    <Input placeholder="example content" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button disabled={createPost.isPending}>
              {createPost.isPending ? 'Creating post...' : 'Create post'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostForm;
