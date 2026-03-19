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

export const addUser = ( firstName, lastName, username, password, email, phone, birthYear, gender, req) => {
    if (!req.session.users) {
        req.session.users = [];
    }
    req.session.users.push({ firstName, lastName, username, password, email, phone, birthYear, gender });
    console.log(req.session.users);
    return true;
}

