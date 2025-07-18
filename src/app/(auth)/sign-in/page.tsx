'use client';
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react";
import { useForm } from "react-hook-form"
import Link from "next/link";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {Loader2} from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

const Page = () =>{ 
  const [isSubmitting , setIsSubmitting] = useState(false);
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver : zodResolver(signInSchema),
    defaultValues : {
      identifier : '',
      password : ''
    }
  })

  const onSubmit = async (data : z.infer<typeof signInSchema>)=>{
        setIsSubmitting(true);
        const result = await signIn('credentials',{
            redirect : false,
            identifier : data.identifier,
            password : data.password
        });
    console.log(result);
    if(result?.error){
        toast.message("Login failed",{
            description : result.error.includes("Unexpected token") 
              ? "Auth API route misconfigured or missing. Check /api/auth/[...nextauth] and NEXTAUTH_URL in .env.local."
              : "Incorrect username or password"
        })
    }

    if(result?.url){
        router.replace('/dashboard')
    }
  }
  return (
    <div className=" flex justify-center items-center min-h-screen bg-gray-100">
      <div className=" w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className=" text-center">
          <h1 className=" text-4xl font-extrabold tracking-tight lg:text-5xl mb-6"> Join ConfessIt </h1>
          <p className=" mb-4">Signin to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
             <FormField
              name="identifier"
              control={form.control}
              render={({field}) =>(
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="email/username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
             />

             <FormField
              name="password"
              control={form.control}
              render={({field}) =>(
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
             />
             <Button type="submit" disabled={isSubmitting}>
                {
                  isSubmitting ? (
                    <>
                      <Loader2 className=" mr-2 h-4 w-4 animate-spin"/> Please wait
                    </>
                  ) : ('Signin')
                }
             </Button>
          </form>
        </Form>
        <div className=" text-center mt-4">
          <p>
            Does not have an account ? {' '}
            <Link href="/sign-up" className=" text-blue-600 hover:text-blue-800">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page;
