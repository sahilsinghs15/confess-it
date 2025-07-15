import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { Message } from "@/model/user.model";

export async function POST(request : Request){
    await dbConnect();
    const {username , content} = await request.json();
    try {
        const user = await UserModel.findOne({username : username});
        if(!user){
            return Response.json(
                {
                    success : false,
                    message : "User not found"
                },
                { status : 404}
            )
        }
        if(!user.isAcceptingMsgs){
            return Response.json(
                {
                    success : false,
                    message : "User does not accept messages"
                },
                { status : 403}
            )
        }
        const newMessage = {content , createdAt : new Date()};
        user.messages.push(newMessage as Message);
        await user.save();
        return Response.json(
            {
                success : true,
                message : "Message Sent Successfully"
            },
            { status : 200}
        )
    } catch (error) {
        console.error("Error in Sending Messages",error);
        return Response.json({
            success : false,
            message : "Error in Sending Messages"
        },{status : 500})
    }
}