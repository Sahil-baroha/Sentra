import { User } from "../models/user.Model.js"
import httpStatus from "http-status"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const login = async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({ message: "Please Provide Credentials !" })
    }
    try {
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User Not Found !" })
        }
        if (await bcrypt.compare(password, user.password)) {
            let token = jwt.sign(
                { id: user._id, username: user.username },  // payload
                process.env.JWT_SECRET,                     // secret
                { expiresIn: process.env.JWT_EXPIRES_IN }   // optional expiry
            );
            user.token = token
            await user.save();
            return res.status(200).json({ token, message: "Login Successful!" });
        }
    } catch (error) {
        res.status(500).json({ message: `Something went Wrong ! : ${error}` })
    }
}

const register = async (req, res) => {
    const { name, username, password } = req.body
    try {
        const if_registered = await User.findOne({ username })

        if (if_registered) {
            return res.status(httpStatus.FOUND).json({ message: "User already exist !" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const NewUser = new User({
            name: name,
            username: username,
            password: hashedPassword
        })
        await NewUser.save()

        res.status(httpStatus.CREATED).json({ message: "New user Registered Sucessfully !" })

    } catch (error) {
        res.json({ message: `Something went wrong : ${error}` })
    }

}

export { login, register }
