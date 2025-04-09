"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../../utils/users");
const data_1 = require("../../utils/data");
const router = (0, express_1.Router)();
router.get('/me', async (req, res) => {
    try {
    }
    catch (error) {
        res.status(400).json({ message: "An unknown error occurred" });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        const users = (0, users_1.getUsers)();
        const user = users.find((user) => user.email === email);
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        //@ts-ignore
        if (user.password != password) {
            res.status(400).json({ message: "Invalid password" });
            return;
        }
        //@ts-ignore
        res.status(200).json({ accessToken: email, admin: user?.admin?.toLowerCase() === "admin" || false });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "An unknown error occurred" });
    }
});
router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        const users = (0, users_1.getUsers)();
        const user = users.find((user) => user.email === email);
        if (user) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        (0, users_1.writeData)({ email, password });
        (0, data_1.createUserData)(email);
        res.status(200).json({ accessToken: email });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "An unknown error occurred" });
    }
});
exports.default = router;
