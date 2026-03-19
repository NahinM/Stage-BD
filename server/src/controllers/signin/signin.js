import * as signInModel from "../../models/signin/signin.js";

export const signIn = (req, res) => {
    const { username, password } = req.body;
    if (signInModel.validateUser(username, password, req.session)) {
        res.send({ message: 'Sign-in successful!', user: signInModel.getUserDetail(username, req.session) });
    } else {
        res.status(401).send({ message: 'Invalid username or password.' });
    }
}