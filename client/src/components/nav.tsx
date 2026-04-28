import { Link } from "react-router-dom";
import { useUserStore, userLogout, refreshUserIfNeeded } from "@/store/User/user";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect } from "react";

interface Pages {
    name: string;
    href: string;
}

export default function Nav({ pages }: { pages: Pages[] }) {

    const user = useUserStore((state) => state.user);
    useEffect(() => {
        (async () => {
            await refreshUserIfNeeded();
        })();
    }, [])

    return (
        <nav className="flex flex-row fixed top-0 left-0 right-0 z-50 px-4 py-3 backdrop-blur-sm items-center">
            <div>
                <a className="font-bold text-slate-900 hover:text-sky-700 transition-colors border border-slate-300 hover:border-slate-500 px-4 py-1 rounded-md"> StageBD</a>
            </div>
            <div className="grow"></div>
            <ul className="flex flex-row gap-1 items-center">
                {pages.map((page) => (
                    <li
                        key={page.href}
                    >
                        <Link to={page.href}
                            className="font-medium text-slate-700 hover:text-slate-900 px-3 py-1 rounded-md border border-slate-300 hover:border-slate-500 transition-colors"
                        >{page.name}</Link>
                    </li>
                ))}
                <li
                    className="relative min-w-[40px] h-[30px]"
                >
                    {user ? (
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="font-bold text-white w-[40px] h-[40px] hover:text-slate-200 rounded-full border border-slate-300 hover:border-slate-500 transition-colors bg-slate-500">
                                    {user.firstname[0].toUpperCase()}
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <Link to="/profile">Profile</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Link to="/settings">Settings</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <button onClick={userLogout}>Logout</button>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                    ) : (
                        <Link to="/signin"
                            className="font-medium text-slate-700 hover:text-slate-900 px-3 py-1 rounded-md border border-slate-300 hover:border-slate-500 transition-colors"
                        >Sign in</Link>
                    )}
                </li>
            </ul>
        </nav>
    )
}