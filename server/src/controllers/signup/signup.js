import { sendEmail } from "../../middlewares/mail/zoho-mail.js";
import * as signupModel from "../../models/signup/signup.js";
import { getHashedPassword } from "../../middlewares/authentication/hashpass.js";

const validate = async (username, email, phone) => {
    let usernameValid = await signupModel.validateUserName(username);
    console.log("Username validation result:", usernameValid);
    if(!usernameValid) {
        return { success: false, error: "Username already exists" };
    }
    let emailValid = await signupModel.validateEmail(email);
    console.log("Email validation result:", emailValid);
    if(!emailValid) {
        return { success: false, error: "Email already exists" };
    }
    let phoneValid = await signupModel.validatePhone(phone);
    console.log("Phone validation result:", phoneValid);
    if(!phoneValid) {
        return { success: false, error: "Phone number already exists" };
    }
    return { success: true };
}

export const signUp = async ( req, res ) => {
    const { firstname, lastname, username, password, email, phone, birthYear, gender } = req.body;
    const validation = await validate(username, email, phone);
    if (!validation.success) {
        return res.status(400).json({ error: validation.error });
    }
    const hashedPassword = await getHashedPassword(password);
    if (!hashedPassword) {
        console.error("Password hashing failed");
        return res.status(500).json({ error: "Failed to hash password" });
    }
    if (signupModel.addUser( firstname, lastname, username, hashedPassword, email, phone, birthYear, gender)) {
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