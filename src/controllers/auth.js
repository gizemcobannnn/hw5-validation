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
        createHttpError(error.status,error.message)
    }
}