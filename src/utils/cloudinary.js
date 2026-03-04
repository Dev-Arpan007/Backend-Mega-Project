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
        console.log("From Cloudinary, response:\n ", response )
        fs.unlinkSync(localFilePath) // after completion of uploading files to cloudinary, delete from local storage

        
//         From Cloudinary, response:
//   {
//   asset_id: '991f1a8ca4c24c46ad49e97ca37679e5',
//   public_id: 'vh8df6nhotiq5pbbaxpi',
//   version: 1772611135,
//   version_id: 'ac9cf6de3c53ff5f4962a9729ad91a7a',
//   signature: '015ac6eeca60d9f35b34d2a875e94e2d4d968254',
//   width: 2992,
//   height: 2992,
//   format: 'jpg',
//   resource_type: 'image',
//   created_at: '2026-03-04T07:58:55Z',
//   tags: [],
//   bytes: 450082,
//   type: 'upload',
//   etag: '2bc87fad9249a5c9aa2360215ecaae1e',
//   placeholder: false,
//   url: 'http://res.cloudinary.com/dusniyqvj/image/upload/v1772611135/vh8df6nhotiq5pbbaxpi.jpg',
//   secure_url: 'https://res.cloudinary.com/dusniyqvj/image/upload/v1772611135/vh8df6nhotiq5pbbaxpi.jpg',
//   asset_folder: '',
//   display_name: 'vh8df6nhotiq5pbbaxpi',
//   original_filename: 'IMG-20241225-WA0047',
//   api_key: '857736575156664'
// }
        return response


    }catch(error){
        fs.unlinkSync(localFilePath) //remove the locally saved temp file as the upload operation got failed in synchronisation

        return null
    }


}

export {uploadOnCloudinary}

