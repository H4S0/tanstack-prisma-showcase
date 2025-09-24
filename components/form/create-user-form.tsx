'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

const CreateUserSchema = z.object({
  username: z.string(),
  email: z.email(),
});

const CreateUserForm = ({ queryKey }: { queryKey: QueryKey }) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
  });

  const createUser = usePrismaMutation({
    model: 'user',
    operation: 'create',
    queryKey,
  });

  const onSubmit: SubmitHandler<z.infer<typeof CreateUserSchema>> = (data) => {
    createUser.mutate(
      { data },
      {
        onSuccess: (response) => {
          toast.success('User created successfully!');
          setIsOpen(false);
          form.reset({
            username: '',
            email: '',
          });
        },
        onError: (error) => {
          toast.error(`Error creating user: ${error.message}`);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create user</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username123" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="test@example.ta" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button>
              {createUser.isPending ? 'Creating user...' : 'Create user'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserForm;
