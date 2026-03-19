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

export const signUp = ( req, res ) => {
    const { username, password, email, phone, birthYear, gender } = req.body;
    const validation = validate(username, email, phone);
    if (!validation.success) {
        return res.status(400).json({ error: validation.error });
    }
    if (signupModel.addUser(username,password,email, phone, birthYear, gender)) {
        res.status(200).json({ message: "Sign-up successful!" });
    }
}