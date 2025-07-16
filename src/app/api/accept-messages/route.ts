import { authOptions } from "@/app/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { getServerSession } from "next-auth";
import { User } from "next-auth";

export async function POST(request : Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;

    if(!session || !session.user){
        return Response.json({
            success : false,
            message : "Not authenticated"
        },{status : 401})
    }

    const userId = user?._id;
    const {acceptMessages} = await request.json();

    try{
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMsgs : acceptMessages},
            {new : true}
        )
        if(!updatedUser){
            return Response.json({
                success : false,
                message : "Failed to update user status to accept messages"
            },{status : 401})
        }

        return Response.json({
            success : true,
            message : "User message acceptance Status Updated Successfully",
            data : updatedUser
        },{status : 200})

    }catch(error){
        console.error("Failed to update user status to accept messages",error);
        return Response.json({
            success : false,
            message : "Failed to update user status to accept messages"
        },{status : 500})
    }
}

export async function GET(){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;

    if(!session || !session.user){
        return Response.json({
            success : false,
            message : "Not authenticated"
        },{status : 401})
    }

    const userId = user?._id;
    try {
        const foundUser = await UserModel.findById(userId);
        if(!foundUser){
            return Response.json({
                success : false,
                message : "User Not found"
            },{status : 404})
        }

        return Response.json({
            success : true,
            isAcceptingMsgs : foundUser.isAcceptingMsgs
        },{status : 200})

    }catch(error){
        console.error("Error in checking Acceptance Message Status",error);
        return Response.json({
            success : false,
            message : "Error in checking Acceptance Message Status"
        },{status : 500})
    }
}