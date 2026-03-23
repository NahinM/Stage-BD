import { getUser, type User } from "@/local-db/user";

export default function Home() {
    const user:User | null = getUser();
    console.log("User in Home component: ", user);

    return (
        <>
        <h1>Welcome to the Home Page {user?.firstname}</h1>
        </>
    )
}