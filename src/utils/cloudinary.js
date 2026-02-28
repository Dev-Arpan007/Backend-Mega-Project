//uploading file that was temporarily stored in server


import { v2 as cloudinary } from 'cloudinary';
import fs from "fs" // file system for node.js

// Configuration
cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME , 
    api_key:process.env.CLOUDINARY_API_KEY , 
    api_secret:process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath)=>{

    try{
        if(!localFilePath)return null

        //upload file if local path available
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: 'auto'
        })

        //file uploaded successfully
        console.log("file successfully uploaded", response.url)
        return response


    }catch(error){
        fs.unlinkSync(localFilePath) //remove the locally saved temp file as the upload operation got failed in synchronisation

        return null
    }


}


