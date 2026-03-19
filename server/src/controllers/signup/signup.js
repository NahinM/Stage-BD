import { sendEmail } from "../../middlewares/mail/zoho-mail.js";
import * as signupModel from "../../models/signup/signup.js";

const validate = (username, email, phone) => {
    if(signupModel.validateUserName(username)) {
        return { success: false, error: "Username already exists" };
    }
    if(signupModel.validateEmail(email)) {
        return { success: false, error: "Email already exists" };
    }
    if(signupModel.validatePhone(phone)) {
        return { success: false, error: "Phone number already exists" };
    }
    return { success: true };
}

export const signUp = async ( req, res ) => {
    const { username, password, email, phone, birthYear, gender } = req.body;
    const validation = validate(username, email, phone);
    if (!validation.success) {
        return res.status(400).json({ error: validation.error });
    }
    if (signupModel.addUser(username,password,email, phone, birthYear, gender)) {
        const emailSent = await sendEmail(email, "Welcome to StageBD!", "Thank you for signing up for StageBD. We're excited to have you on board!");
        if (!emailSent) {
            res.status(400).json({ message: "Failed to send welcome email." });
            return;
        }
        res.status(200).json({ message: "Sign-up successful!" });
    }else {
        res.status(400).json({ message: "Failed to add user." });
    }
}