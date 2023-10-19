class CustomAPIError extends Error{
    constructor(message , statusCode){ // a constructor message is a special message we invoke when we create a new instance of a class , in our case we will pass 2 arguments : the error message and a status code

        //super method invokes a constructor of a parent class, in our case we pass the message value
        //as a result we will have the methods and properties of the parent 
        //by this.statusCode we create a statusCode property as well

        //this is how we create our new custom error class 
        super(message)
        this.statusCode = statusCode
    }
}

const createCustomError = (msg , statusCode) =>{
    return new CustomAPIError(msg, statusCode)
}

module.exports = {createCustomError , CustomAPIError}