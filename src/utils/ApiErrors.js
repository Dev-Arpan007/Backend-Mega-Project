// file  to make a standar format for Api's and Error formats
// since we are making a class file that's why the first letter of the class name is in Caps

// we are extending standard error class

class ApiError extends Error{
    constructor(statusCode, message="Something went wrong", errors = [], stack ="" ){


        super(message)// calling the parent class constructor so that we can use 'this.' to override the variables
        this.statusCode = statusCode
        this.data = null // useful data to return after Api call, initially nul, after successful api call it will be initialised and returned
        this.message = message
        this.success = false
        this.errors = errors

        if(stack){
            this.stack = stack //trace of executuion
        }else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}


export {ApiError}


//Now we can throw custom ApiErrors with details in json format