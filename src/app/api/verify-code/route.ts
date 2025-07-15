import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

export async function POST(request : Request){
    await dbConnect();
    try{
        const {username,code} = await request.json();
        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json({
                success : false,
                message : "User does not exist , Please signup"
            })
        }

        const isCodeCorrect = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date(); 

        if(isCodeCorrect && isCodeNotExpired){
            user.isVerified = true;
            await user.save();
            return Response.json({
                success : true,
                message : "Verified the user"
            },{status : 200})
        }else if(!isCodeNotExpired){
            return Response.json({
                success : false,
                message : "Verification code expired"
            },{status : 400})
        }else{
            return Response.json({
                success : false,
                message : "Verification code is incorrect"
            },{status : 400})
        }
    }catch(error){
        console.error("Error Verifying code",error);
        return Response.json({
            success : false,
            message : "Error Verifying code"
        },{status : 500})
    }
}