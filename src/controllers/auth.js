import createHttpError from 'http-errors'
import { getUser,createUser } from '../services/auth';
export const getAuthController = async(req, res,next) =>{
    try{
        const {name, email, password} = req.body;
        const user = await getUser(email);
        if(user){
            return next(createHttpError(409,'Email in use'));
        }

        const newUser = await createUser({name, email, password});
        const userwithoutpass = {...newUser};
        delete userwithoutpass.password;

        res.status(201).json({
            status:201,
            message: "Successfully registered a user!",
            data: userwithoutpass
        })
        
    }catch(error){
        next(createHttpError(500,error.message));
    }
}

export const loginAuthController = async(req,res,next)=>{
    try{
        const {email,password} = req.body;

        const user = getUser(email);
        if(!user){
            return next(createHttpError(401, 'User not found'));
        }
        if (user.password !== password) {
            return next(createHttpError(401, 'Invalid credentials'));
        }

        const createUser = await createUser({email,password});
        const usernopassword = {...createUser};
        delete usernopassword.password;

        res.status(200).json({
            status:200,
            message: "Successfully logged in!",
            data: usernopassword
        })
    }catch(e){
        createHttpError(500,e.message)
    }
}