import { authOptions } from "@/app/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { User } from "next-auth";

export async function DELETE(request : Request, {params} : {params : {messageId : string}}){
    const messageId = params.messageId;
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;

    if(!session || !session.user){
        return Response.json({
            success : false,
            message : "Not authenticated"
        },{status : 401})
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const updatedResult = await UserModel.updateOne(
            {_id : userId},
            {$pull : {messages : {_id : messageId}}}
        )

        if(updatedResult.modifiedCount == 0){
            return Response.json({
                success : false,
                message : "Message not found or already deleted"
            },{status : 404})
        }

        return Response.json({
            success : true,
            message : "Message Deleted"
        },{status : 200})
    } catch (error) {
        console.error("Error in Deleting Message",error);
        return Response.json({
            success : false,
            message : "Error in Deleting Message"
        },{status : 500})
    }
    
}