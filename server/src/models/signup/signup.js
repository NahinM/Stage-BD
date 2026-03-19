const users = [
    {
        username: "john_doe",
        email: "john.doe@example.com",
        phone: "1234567890",
    }
];

export const validateUserName = (username) => {
    const user = users.find(u => u.username === username);
    return user ? user.username : null;
}

export const validateEmail = (email) => {
    const user = users.find(u => u.email === email);
    return user ? user.email : null;
}

export const validatePhone = (phone) => {
    const user = users.find(u => u.phone === phone);
    return user ? user.phone : null;
}

export const addUser = (username, password, email, phone, birthYear, gender) => {
    console.log("username: ", username);
    console.log("password: ", password);
    console.log("email: ", email);
    console.log("phone: ", phone);
    console.log("birthYear: ", birthYear);
    console.log("gender: ", gender);
    return true;
}

