import {z} from "zod";

export const usernameValidation = z
    .string()
    .min(2,"Username must be atleast two characters")
    .max(20,"Username must be no more than 14 characters")
    .regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special character")

export const signUpSchema = z.object({
    username : usernameValidation,
    email : z.string().email({message : "Invalid email address"}),
    password : z.string().min(6,{message : "Password must be at least 6 characters"}).max(20,{message : "Password must not be more than 20 charaters"})
})