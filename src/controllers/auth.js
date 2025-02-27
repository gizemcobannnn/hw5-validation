import createHttpError from 'http-errors'
import { getUser,createUser,loginUser, refreshUser, logoutUser, requestResetToken, resetPassword} from '../services/auth.js';
import { ONE_DAY } from '../constants/index.js';

export const loginUserController =  async(req,res) =>{
        const session = await loginUser(req.body);
      
        res.cookie('refreshToken', session.refreshToken, {
          httpOnly: true,
          expires: new Date(Date.now() + ONE_DAY),
        });
        res.cookie('sessionId', session._id, {
          httpOnly: true,
          expires: new Date(Date.now() + ONE_DAY),
        });
      
        res.json({
          status: 200,
          message: 'Successfully logged in an user!',
          data: {
            accessToken: session.accessToken,
          },
        });
      };
      
  const setupSession = (res, session) => {
    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
    });
    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
    });
  };
export const refreshUserController = async(req,res,next) =>{
    try{
      const session = await refreshUser({
        sessionId: req.cookies.sessionId,
        refreshToken: req.cookies.refreshToken,
      });
      console.log(session)
      console.log("Cookies:", req.cookies);
     
      setupSession(res, session);
        res.status(200).json({
            status: 200,
            message:"Successfully refreshed a session!",
            data:{ accessToken: session.accessToken,}

        })
    }catch(e){
        next(createHttpError(e.status||500,e.message));
    }
}
export const createAuthController = async(req, res,next) =>{
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
    const session = await loginUser(req.body);
    console.log(session._id);

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
    });
    res.cookie('sessionId', session._id.toString(), {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY),
    });
  
    res.json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: {
        accessToken: session.accessToken,
      },
    });
}catch(e){
        next(createHttpError(500,e.message));
    }
}

export const logoutAuthController = async(req,res,next) =>{
    try {
        const sessionId = req.cookies.sessionId; // Cookie'den alıyoruz
        console.log("Session ID:", sessionId);   // Logla

        if (!sessionId) {
            throw createHttpError(400, 'Session ID is missing');
        }
        if (!sessionId) {
            throw createHttpError(400, 'Session ID not found in cookies');
        }

        await logoutUser(sessionId);

        // Cookie'leri temizle
        res.clearCookie('sessionId');
        res.clearCookie('refreshToken');

        res.status(204).send();
    } catch (e) {
        next(createHttpError(e.status || 500, e.message));
    }
}


export const requestResetEmailController = async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const mailOptions = {
      from: process.env.SMTP_USER, // Gönderen e-posta adresi
      to,
      subject,
      text,
    };

    await requestResetToken(mailOptions);
    res.status(200).json({ message: 'Reset password email has been successfully sent.'});
  } catch (error) {
    res.status(500).json({ message: 'Email sending failed', error: error.message });
  }

};



export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};