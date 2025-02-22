import createHttpError from "http-errors";
import userCollection from "../db/models/user.js";
import jwt from 'jsonwebtoken';
import sessionCollection from '../db/models/session.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/index.js";
import { randomBytes } from 'crypto';



dotenv.config();
const ACCESS_TOKEN_EXPIRY = '15m';

const REFRESH_TOKEN_EXPIRY = '30d';

export const loginUser= async(payload)=>{
    const user = await userCollection.findOne({email:payload.email});
    if (!user) {
        throw createHttpError(404, 'User not found')
    }

    const isEqual = await bcrypt.compare(payload.password, user.password); // Порівнюємо хеші паролів

    if (!isEqual) {
      throw createHttpError(401, 'Unauthorized');
    }

    await sessionCollection.deleteOne({userId: user._id})

    const accessToken= jwt.sign({userId:user._id},process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const refreshToken= jwt.sign({userId: user._id}, process.env.JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

    const session = await sessionCollection.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    });
    console.log("Created session:", session); 

    return {
        session
    };
}

const createSession = () => {
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');
  
    return {
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
      refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    };
  };
export const refreshUser= async({ sessionId, refreshToken })=>{
    const session = await sessionCollection.findOne({_id: sessionId, refreshToken});
    if (!session) {
        throw createHttpError(401, 'Session not found');
      }

    const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

    if (isSessionTokenExpired) {
        throw createHttpError(401, 'Session token expired');
    }

    const newSession = createSession();

    await sessionCollection.deleteOne({ _id: sessionId, refreshToken });

    return await sessionCollection.create({
        userId:session.userId,
        ...newSession,
    });

} 
export const getUser= async(email) =>{  
    try{
        const userAuth = await sessionCollection.findOne({email:email});
        return userAuth;
    }catch(e){
        throw new Error("Failed to fetch users",e);
    }

}

export const createUser= async(payload)=>{
    try{
        const user = userCollection.findOne({email:payload.email});
        if(user) createHttpError(409,"Email in use")

        const encryptedPassword = await bcrypt.hash(payload.password, 10);
        const createdUser =  await userCollection.create({
            ...payload,
            password: encryptedPassword,
          });
        return createdUser;

    }catch(e){
        throw createHttpError(e.status || 500, e.message || "Failed to create user");
    }
}
export const logoutUser = async (sessionId) => {
try {
    if (!sessionId) {
        throw createHttpError(400, 'Session ID is required');
    }

    const session = await sessionCollection.findOne({ _id: sessionId });

    if (!session) {
        throw createHttpError(401, 'Session not found');
    }

    await sessionCollection.deleteOne({ _id: sessionId });

    return { message: 'Successfully logged out!' };
} catch (e) {
    throw createHttpError(e.status || 500, e.message || 'Logout failed');
} 
};

