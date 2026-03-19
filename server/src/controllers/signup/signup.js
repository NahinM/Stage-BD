

export const signUp = ( req, res ) => {
    const { username, password, email, phone, birthYear, gender } = req.body;
    console.log("username: ", username);
    console.log("password: ", password);
    console.log("email: ", email);
    console.log("phone: ", phone);
    console.log("birthYear: ", birthYear);
    console.log("gender: ", gender);
    res.status(200).json({ message: "Sign-up successful!" });
}