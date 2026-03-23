import bcrypt from 'bcrypt';
const saltRounds = 10;

// 1. Hashing a password
const getHashedPassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}


// 2. Comparing/Verifying a password
const verifyPassword = async (password, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Error verifying password:', error);
        throw error;
    }
}

export { getHashedPassword, verifyPassword };
