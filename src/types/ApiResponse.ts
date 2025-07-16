import { Message } from "@/model/user.model";
export interface ApiResponse{
    success : boolean;
    message : string;
    isAcceptingMsgs? : boolean;
    messages? : Array<Message>;
}

