import createHttpError from "http-errors";
import { authCollection } from "../db/auth.js";
import jwt from 'jsonwebtoken';
import { sessionCollection } from '../db/session.js';

const ACCESS_TOKEN_EXPIRY = '15m';

const REFRESH_TOKEN_EXPIRY = '30d';

export const loginUser= async({email,password})=>{
    const user = await authCollection.findOne({email});
    if (!user || user.password !== password) {
        throw createHttpError(401, 'Invalid email or password');
    }

    await sessionCollection.deleteMany({userId: user._id})

    const accessToken= jwt.sign({userId:user._id},process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const refreshToken= jwt.sign({userId: user._id}, process.env.JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

    await sessionCollection.create({
        userId:user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 dakika
        refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 gün
    });

    return {accessToken,refreshToken};
}

export const refreshUser= async({token})=>{
    const session = await sessionCollection.findOne({refreshToken:token});
    if (!session) {
        throw createHttpError(401, 'Invalid or expired refresh token');
    }

    await sessionCollection.deleteMany({userId: session.userId});

    const accessToken= jwt.sign({userId:session.userId},process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const refreshToken= jwt.sign({userId: session.userId}, process.env.JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

    await sessionCollection.create({
        userId:session.userId,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 dakika
        refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 gün
    });

    return {accessToken,refreshToken};
} 
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

export const logoutUser = async({token})=>{
    try{
        const session =await sessionCollection.findOne({refreshToken:token})
        if(!session){
            throw createHttpError(401, 'Invalid or expired refresh token');
        }
        await sessionCollection.deleteMany({refreshToken:token});

    return { message: 'Successfully logged out!' };
    
    }catch(e){
        throw createHttpError(e.status,e.message)
    }
}