'use client';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const VerifyAccount = () => {
    const router = useRouter();
    const params = useParams<{username : string}>();
    //zod implementation
    const form = useForm<z.infer<typeof verifySchema>>({
    resolver : zodResolver(verifySchema),
    
    })

    const onSubmit = async (data : z.infer<typeof verifySchema>)=>{
        try {
            const response = await axios.post<ApiResponse>("/api/verify-code",{
                username : params.username,
                code : data.code
            });

            toast.message("Success" , {
                description : response.data.message
            });
            router.replace('/sign-in');
        } catch (error) {
            console.error("Error in verification of user",error);
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message;
            toast.message("Verification failed",{
            description : errorMessage
            })
        }
    }
    return (
        <div className=" flex justify-center items-center min-h-screen bg-gray-100">
            <div className=" w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className=" text-center">
                    <h1 className=" text-4xl font-extrabold tracking-tight lg:text-5xl mb-6"> Verify Your Account </h1>
                    <p className=" mb-4">Enter the verification code sent to your email</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Verification Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="code" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default VerifyAccount;
