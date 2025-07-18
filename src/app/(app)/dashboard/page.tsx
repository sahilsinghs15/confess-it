'use client';
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/user.model";
import { acceptMsgSchema } from "@/schemas/acceptMsgSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Dashboard = () => {
  const [messages , setMessages] = useState<Message[]>([]);
  const [isLoading , setIsLoading] = useState(false);
  const [isSwitchLoading , setIsSwitchLoading] = useState(false);
  const [profileUrl , setProfileUrl] = useState("");
  const handleDeletedMessage = (messageId : string) =>{
    setMessages(messages.filter((message) => message._id !== messageId));
  }

  const {data: session} = useSession();
  const form = useForm({
    resolver : zodResolver(acceptMsgSchema)
  })

  const {register,watch,setValue} = form;
  const acceptMessages = watch('acceptMessages');
  const fetchAcceptMessage = useCallback(async()=>{
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages',response.data.isAcceptingMsgs!);// i was getting issue here so to resolve it i have given it not null 
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.message("Error" , {
        description : axiosError.response?.data.message || "Failed to fetch message settings"
      })
    }finally{
      setIsSwitchLoading(false);
    }
  },[setValue])

  const fetchMessages = useCallback(async(refresh : boolean = false) =>{
    setIsLoading(true);
    setIsSwitchLoading(false);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || []);
      if(refresh){
        toast.message("Refreshed messages",{
          description : "Showing latest messages"
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.message("Error" , {
        description : axiosError.response?.data.message || "Failed to fetch message settings"
      })
    }finally{
      setIsSwitchLoading(false);
      setIsLoading(false);
    }
  },[setIsLoading , setMessages])

  useEffect(()=>{
    if(!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  },[session,setValue,fetchAcceptMessage,fetchMessages])

  //handle switch change 
  const handleSwitchChange = async ()=>{
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages',{
        acceptMessages : !acceptMessages
      });
      setValue('acceptMessages',!acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.message("Error" , {
        description : axiosError.response?.data.message || "Failed to update accept message settings"
      })
    }
  }
  
  useEffect(()=>{
    if(typeof window !== "undefined" && session?.user?.username){
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      setProfileUrl(`${baseUrl}/u/${session.user.username}`)
    }
  },[session])

  const copyToClipboard = ()=>{
    navigator.clipboard.writeText(profileUrl);
    toast.message("URL Copied",{
      description : "Profile URL has been copied to clipboard"
    })
  }

  if(!session || !session.user){
    return <div className=" flex items-center justify-center font-bold text-2xl">Please Login!</div>
  }
  return (
    <div className=" my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className=" text-4xl font-bold mb-4">User Dashboard</h1>

      <div className=" mb-4">
        <h2 className=" text-lg font-semibold mb-2"> Copy Your unique link</h2>{' '}
        <div className=" flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className=" input input-bordered w-full p-2 mr-2" 
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className=" mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading} 
        />
        <span className=" ml-2"> Accept messages : {acceptMessages ? 'On' : 'Off'}</span>
      </div>

      <Separator/>

      <Button
        className=" mt-4"
        variant="outline"
        onClick={(e) =>{
          e.preventDefault();
          fetchMessages(true);
        }} 
      >
        {isLoading ? (
          <Loader2 className=" h-4 w-4 animate-spin" />
        ):(
          <RefreshCcw className=" h-4 w-4"/>
        )}
      </Button>

      <div className=" mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) =>(
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeletedMessage} 
            />
          ))
        ):(
          <p>No Message to Display</p>
        )}
      </div>

    </div>
  )
}

export default Dashboard;
