const asyncWrapper  = (fn) =>{ 
    return async(req,res,next) =>{
        try{
            await fn(req,res,next)//waiting for the promise to be resolved or rejected
        }catch(error){
            next(error)//passing the error to another middleware which will handel the errors
        }
    }
}

module.exports = asyncWrapper

//wrapping the controller into the middleware