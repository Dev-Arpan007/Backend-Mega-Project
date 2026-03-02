const asyncHandler = (fn)=>{
    return (req, res, next)=>{
        Promise.resolve(fn(req, res, next)).catch((err)=>next(err))
    }
} // it's a higher order function, it takes a function, executes it and returns as a function


export {asyncHandler}

/*
const asyn1 = ( parameter) =>{
    // code for parameter
}

const async2 = (func) =>{
    // code for function, here the parameter is a function

}

const async3 = (fn) => {()=>{ }   }

const async4 = (fn) => () => {}



const asyncHandler1 = (fn) => {
    async (err, req, res, next) =>{
        try {
            await fn(err, req, res, next)
        } catch (error) {
            res.status(error.code || 500).json({
                success: false,
                message : err.message
            })
        }
    }
}

*/