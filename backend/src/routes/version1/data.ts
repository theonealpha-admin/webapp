import { Router } from "express";
import authMiddleware from "../../middlewares/version1";
import { getUserData } from "../../utils/data";
import multer from "multer";
import path from "path";
import fs from 'fs';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'sheets'))
    },
    filename: (req, file, cb) => {
        const filename = file.fieldname;
        //const destinationPath = path.join(path.dirname(process.cwd()), 'sheets', `${filename}.xlsx`);
        //const destinationPath = path.join(process.cwd(), 'backend', 'sheets', `${filename}.xlsx`);
        const destinationPath = path.join(process.cwd(), 'sheets', `${filename}.xlsx`);

        
        // Check if file already exists and delete it
        if (fs.existsSync(destinationPath)) {
            fs.unlinkSync(destinationPath);
        }
        
        console.log('File uploaded successfully', destinationPath);
        cb(null, `${filename}.xlsx`);
    }
});

const upload = multer({ storage });
const router = Router();

router.get('/', authMiddleware, async (req, res) => {
    try {
        //@ts-ignore
        if(!req?.user?.email) {
            res.status(400).json({ message: "An unknown error occurred" });
            return;
        }
        //@ts-ignore
        const data = await getUserData(req.user.email);

        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "An unknown error occurred" });
    }
});

router.post('/upload', upload.any(), async (req, res) => {
    try {
        // if(!req?.user || !req?.user?.admin || req?.user?.admin?.toLowerCase() !== "admin") {
        //     res.status(400).json({ message: "Unauthorized" });
        //     return;
        // }
        //@ts-ignore
        if (req.files.length === 0) {
            res.status(400).json({ message: "File is required" });
            return;
        }

        res.status(200).json({ message: "File uploaded successfully" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "An unknown error occurred" });
    }
});

export default router;
