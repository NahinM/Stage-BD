export const validateUser = (username, password, session) => {
    const user = session.users.find(user => user.username === username && user.password === password);
    return user !== undefined;
}

export const getUserDetail = (username, session) => {
    const user = session.users.find(user => user.username === username);
    return user;
}