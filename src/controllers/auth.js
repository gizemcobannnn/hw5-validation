import createHttpError from 'http-errors'
import { getUser,createUser,loginUser, refreshUser, logoutUser} from '../services/auth';

export const loginUserController =  async(req,res,next) =>{
    try{
        const {email, password} = req.body;
        const {accessToken,refreshToken} =await loginUser({email, password});
    
        res.status(200).json({
            status:200,
            message:"Successfully logged in an user!",
            data: {accessToken,refreshToken}
        })
    }catch(error){
        next(createHttpError(error.status || 500, error.message));
    }
}

export const refreshUserController = async(req,res,next) =>{
    try{
        const {refreshtoken} = req.cookies;
        if(!refreshtoken){
            return next(createHttpError('401','No refresh token provided'));
        }

        const {accessToken} = await refreshUser({token:refreshUser})
        res.status(200).json({
            status: 200,
            message:"Successfully refreshed a session!",
            data:{accessToken}
        })
    }catch(e){
        next(createHttpError(e.status||500,e.message));
    }
}
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

        const { accessToken, refreshToken } = await loginUser({ email, password }); // ✅ Doğru kullanım


        res.status(200).json({
            status:200,
            message: "Successfully logged in!",
            data:  { accessToken, refreshToken }
        })
    }catch(e){
        createHttpError(500,e.message)
    }
}

export const logoutAuthController = async(req,res,next) =>{
    try{
        const {refreshToken} = req.cookies;
        if(!refreshToken){
            next(createHttpError(400,"No refresh token provided')"));
        }
        await logoutUser({token:refreshToken});
        res.clearCookie('refreshToken', { httpOnly: true, secure: true });

        res.status(204 ).json({
            status:204,
            message:'logged out',
        })

    }catch(e){
        next(createHttpError(e.status||500,e.message))
    }
}