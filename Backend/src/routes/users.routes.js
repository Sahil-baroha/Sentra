import {Router} from "express";
import {login,register} from "../controller/user.controller.js"
const router  = Router();


router.route("/login").post(login)
router.route("/register").post(register)
router.route("/add_to_activity").post((req, res) => { res.json({ message: "Activity added" }) })
router.route("/get_all_activity").get((req, res) => { res.json({ message: "Activities retrieved" }) })

export default router

