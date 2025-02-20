import createHttpError from "http-errors";
import { authCollection } from "../db/auth.js";
export const getUser= async(email) =>{
    try{
        const userAuth = await authCollection.findOne({email:email}).toArray();
        return userAuth;
    }catch(e){
        throw new Error("Failed to fetch users",e);
    }

}

export const createUser= async(userData)=>{
    try{
        const createdUser =  await authCollection.create(userData);
        return createdUser;
    }catch(e){
        createHttpError(e.status,e.message)
    }
}