import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "./uploads")
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now();
        const fileExtension = file.originalname.split(".").pop();
        cb(null, uniqueSuffix+"."+fileExtension)
    }
})

const upload = multer({storage: storage });

const storage1 = multer.memoryStorage();
const upload1 = multer({storage: storage1})
const myUploadMiddleware = upload1.single("photo");
export const multiUpload = upload1.array("photos", 5)
export default myUploadMiddleware;