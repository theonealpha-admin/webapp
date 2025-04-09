"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const version1_1 = __importDefault(require("../../middlewares/version1"));
const data_1 = require("../../utils/data");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(process.cwd(), 'sheets'));
    },
    filename: (req, file, cb) => {
        const filename = file.fieldname;
        //const destinationPath = path.join(path.dirname(process.cwd()), 'sheets', `${filename}.xlsx`);
        //const destinationPath = path.join(process.cwd(), 'backend', 'sheets', `${filename}.xlsx`);
        const destinationPath = path_1.default.join(process.cwd(), 'sheets', `${filename}.xlsx`);
        // Check if file already exists and delete it
        if (fs_1.default.existsSync(destinationPath)) {
            fs_1.default.unlinkSync(destinationPath);
        }
        console.log('File uploaded successfully', destinationPath);
        cb(null, `${filename}.xlsx`);
    }
});
const upload = (0, multer_1.default)({ storage });
const router = (0, express_1.Router)();
router.get('/', version1_1.default, async (req, res) => {
    try {
        //@ts-ignore
        if (!req?.user?.email) {
            res.status(400).json({ message: "An unknown error occurred" });
            return;
        }
        //@ts-ignore
        const data = await (0, data_1.getUserData)(req.user.email);
        res.status(200).json(data);
    }
    catch (error) {
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
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "An unknown error occurred" });
    }
});
exports.default = router;
