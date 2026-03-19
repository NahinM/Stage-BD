interface User {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone: string;
    birthYear: number
    gender: string;
}

export const setUser = (user:User) => {
    localStorage.setItem("user", JSON.stringify(user));
}

export const getUser = (): User | null => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
}