import { Resend } from "resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email : string, username : string , verifyCode : string) : Promise<ApiResponse>{
    try{
        await resend.emails.send({
            to : email,
            from : 'onboarding@resend.dev',
            subject : 'ConfessIt Verification code',
            react : VerificationEmail({username , otp : verifyCode}),
        });
        return {
            success : true,
            message : "Verification email send successfully"
        }
    }catch(emailError){
        console.error("Error sending verification email",emailError);
        return{
            success : false,
            message : "Failed to send verification email"
        }
    }
}