"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface UpdateUserProfileProps {
  open: boolean;
  setOpen?: (prev: boolean) => void;
}

const formSchema = z.object({
  avatar: z.string().url({ message: "Please enter a valid URL." }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .optional(),
});

export default function UpdateUserProfile({
  open,
  setOpen,
}: UpdateUserProfileProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      avatar: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    open && (
      <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 bg-white p-6 rounded-lg w-full max-w-md relative"
          >
            <X
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen && setOpen(false)}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button onClick={() => form.handleSubmit(onSubmit)} type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    )
  );
}
