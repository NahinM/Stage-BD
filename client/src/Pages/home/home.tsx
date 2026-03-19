import { getUser } from "@/local-db/user";

export default function Home() {
    const user = getUser();
    console.log("User in Home component: ", user);

    return (
        <>
        <h1>Welcome to the Home Page {user?.firstName}</h1>
        </>
    )
}