// @ts-nocheck
export const errorHandler = (err,req,res,next)=>{
	try{
		res.status(err.status || 500).json({
			status: err.status || 500,
			message: "Something went wrong",
			data: err	
		});
	}catch(e){
		next(e)
	}
    
}

export default errorHandler;