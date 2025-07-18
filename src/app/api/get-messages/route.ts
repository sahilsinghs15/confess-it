import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { User } from "next-auth";

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

    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([
            { $match : {_id : userId} },
            { $unwind : '$messages'},
            { $sort : {'messages.createdAt' : -1}},
            { $group : {_id : '$_id',messages : {$push : '$messages'} }}
        ])

        if(!user || user.length == 0){
            return Response.json(
                {
                    success : false,
                    message : "User not found"
                },
                { status : 404}
            )
        }

        return Response.json(
            {
                success : true,
                messages : user[0].messages
            },
            { status : 200}
        )

    }catch(error){
        console.error("Error in Fetching Messages",error);
        return Response.json({
            success : false,
            message : "Error in Fetching Messages"
        },{status : 500})
    }
}