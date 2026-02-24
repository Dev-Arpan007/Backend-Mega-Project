// file  to make a standar format for Api's and Error formats
// since we are making a class file that's why the first letter of the class name is in Caps

// we are extending standard error class

class ApiError extends Error{
    constructor(statusCode, message="Something went wrong", errors = [], stack ="" ){


        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}


export {ApiError}