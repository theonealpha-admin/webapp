import { Router } from "express";
import cypto from "crypto";
import { updateRow, writeData, getUsers } from "../../utils/users";
import { createUserData } from "../../utils/data";
import bcrypt from "bcrypt";

const router = Router();

router.get('/me', async (req, res) => {
    try {

    } catch (error) {
        res.status(400).json({ message: "An unknown error occurred" });
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        const users = getUsers();

        const user = users.find((user: any) => user.email === email);
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        //@ts-ignore
        if(user.password != password) {
            res.status(400).json({ message: "Invalid password" });
            return;
        }
        //@ts-ignore
        res.status(200).json({ accessToken: email, admin: user?.admin?.toLowerCase() === "admin" || false });
    } catch (error) {
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
        const users = getUsers();

        const user = users.find((user: any) => user.email === email);
        if (user) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        writeData({ email, password });

        createUserData(email)

        res.status(200).json({ accessToken: email });
    } catch (error) {
        console.log(error);

        res.status(400).json({ message: "An unknown error occurred" });
    }
});

export default router;