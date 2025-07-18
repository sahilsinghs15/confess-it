"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const UserProfile = () => {
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      const response = await axios.post("/api/send-message", {
        username: params.username,
        content: data.content,
      });

      toast.success("Message Sent Successfully", {
        description: response.data.message,
      });

      form.reset();
    } catch (error) {
      console.error("Error sending message", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;

      toast.error("Failed to send message", {
        description: errorMessage || "Something went wrong",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-200 transition-transform hover:scale-[1.01]">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-800 mb-2">
            Anonymous Confession
          </h1>
          <p className="text-gray-600 text-sm">
            Confess it already — enter a few honest words and feel free!
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Your Message</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type your anonymous message..."
                      {...field}
                      className="h-12 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
            >
              Send Message
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UserProfile;
