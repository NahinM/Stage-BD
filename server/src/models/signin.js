const users = [
    {
        username: 'nahin',
        password: '123456'
    }
]

export const validateUser = (username, password) => {
    const user = users.find(user => user.username === username && user.password === password);
    return user !== undefined;
}