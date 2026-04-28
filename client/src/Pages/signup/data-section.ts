export interface SignUpData {
    username: string;
    firstname: string;
    lastname: string;
    password: string;
    confirmPassword: string;
    email: string;
    phone: string;
    birthyear: number;
    gender: string;
    city: string;
}

export const allCity: string[] = [
    "Barishal",
    "Bogra",
    "Chattogram",
    "Cumilla",
    "Dhaka",
    "Gazipur",
    "Khulna",
    "Mymensingh",
    "Narayanganj",
    "Rajshahi",
    "Rangpur",
    "Sylhet",
];

export const allGender: string[] = ["Male", "Female", "Other"];
