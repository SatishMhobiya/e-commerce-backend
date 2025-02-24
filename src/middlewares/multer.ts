import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "./uploads")
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now();
        console.log("filenameMulter", file)
        const fileExtension = file.originalname.split(".").pop();
        cb(null, uniqueSuffix+"."+fileExtension)
    }
})

const upload = multer({storage: storage });
export default upload;