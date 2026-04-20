import axios from "axios";
import { createElement } from "react";
import { validateSignUpData } from "./validation";
import type { SignUpData } from "./data-section";
import { toast } from "sonner";

const toastBody = (title: string, details?: string[]) => {
    return createElement(
        "div",
        { className: "space-y-2" },
        createElement("p", { className: "font-semibold" }, title),
        details && details.length > 0
            ? createElement(
                "ul",
                { className: "ml-5 list-disc space-y-1 text-sm" },
                ...details.map((detail) => createElement("li", null, detail))
            )
            : null
    );
};

const check_signUpData = (signUpdata: SignUpData): boolean => {
    if (signUpdata.password !== signUpdata.confirmPassword) {
        toast.error(toastBody("Password validation failed", ["Password and confirm password do not match."]), {
            position: "top-center",
        });
        return false;
    }

    const validationResult = validateSignUpData(signUpdata);

    if (!validationResult.success) {
        const message = validationResult.error.issues.map(
            (issue) => `${issue.path.join(".")}: ${issue.message}`
        );

        toast.error(toastBody("Invalid sign up data", message), { position: "top-center" });
        return false;
    }

    return true;
};

export const handleSignUp = async (signUpdata: SignUpData) => {
    if (!check_signUpData(signUpdata)) {
        return;
    }

    const filteredData = {
        username: signUpdata.username,
        firstname: signUpdata.firstname,
        lastname: signUpdata.lastname,
        email: signUpdata.email,
        password: signUpdata.password,
        phone: signUpdata.phone,
        birthYear: signUpdata.birthYear,
        gender: signUpdata.gender,
        city: signUpdata.city,
    };

    axios.post("/api/signup", filteredData).then((res) => {
        toast.success(toastBody("Sign up successful", ["Please log in."]), { position: "top-center" });
        console.log("Sign up successful:", res.data);
    }).catch((err) => {
        console.error("Sign up failed:", err);
        toast.error(toastBody("Sign up failed", ["Please try again."]), { position: "top-center" });
    });
};
