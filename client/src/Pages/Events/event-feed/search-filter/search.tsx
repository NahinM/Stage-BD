import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { fetchUsers, searchAndFilterEvents } from "./api";

import { useCategoryStore } from "@/store/category"
import { useEffect, useState } from "react";
import { setEvents, fetchEvents } from "@/store/Events/event-store.ts";

export default function EventSearchBox() {
    const [searchBy, setSearchBy] = useState<string>("Title");
    const [searchValue, setSearchValue] = useState<string>("");
    const [userId, setUserId] = useState<string>("");
    const [users, setUsers] = useState<{ id: string, username: string, firstname: string, lastname: string }[]>([]);
    const [hideUserList, setHideUserList] = useState<boolean>(false);

    const category = useCategoryStore((state) => state.categories);
    const [SelectedCategoryId, setSelectedCategoryId] = useState<number>(-1);
    const [isFree, setIsFree] = useState<boolean | null>(null);
    const [selectedType, setSelectedType] = useState<string>("All Types");

    useEffect(() => {
        if (category.length === 0) {
            useCategoryStore.getState().fetchCategories();
        }
    }, []);

    const getUsers = (Info: string) => {
        if (Info.trim() === "") {
            setUsers([]);
            return;
        }
        fetchUsers(Info)
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.error("Error fetching users: ", error);
            })
    }

    const getSearchEvents = () => {
        searchAndFilterEvents(searchBy, userId, searchValue, SelectedCategoryId, isFree, selectedType)
            .then((response) => {
                setEvents(response.data);
            })
            .catch((error) => {
                console.error("Error searching events: ", error);
            })
    }

    const handleReset = () => {
        setSearchBy("Title");
        setSearchValue("");
        setUserId("");
        setSelectedCategoryId(-1);
        setIsFree(null);
        setSelectedType("All Types");
        fetchEvents();
    }

    return (
        <div className="flex flex-row w-full mb-4 gap-2 justify-center bg-teal-600/20 p-4 rounded-md">

            {/* Search By */}
            <Select
                defaultValue={"Title"}
                onValueChange={(nextValue) => setSearchBy(nextValue ?? ["Title"][0])}
            >
                <SelectTrigger className="w-28 border border-gray-500">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Search By</SelectLabel>
                        {
                            [
                                "Title",
                                "Organizer"
                            ].map((option, index) => (
                                <SelectItem key={index} value={option}>
                                    {option}
                                </SelectItem>
                            ))
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>

            {/* Search Box */}
            <div className="relative">
                <input
                    type="text"
                    placeholder={`🔍Search by ${searchBy}...`}
                    value={searchValue}
                    onChange={(e) => {
                        setSearchValue(pre => e.target.value);
                        if (searchBy === "Organizer") {
                            getUsers(e.target.value);
                            setHideUserList(false);
                        }
                    }}
                    className="p-1 rounded-md w-64 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {
                    !hideUserList && searchBy === "Organizer" && searchValue.trim() !== "" && (
                        <ul className="absolute top-full left-0 min-w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto z-10 px-2 py-1 flex flex-col gap-1">
                            {
                                users.map((user) => (
                                    <li key={user.id}
                                        className="p-1 hover:bg-gray-200 cursor-pointer rounded-md border border-gray-300 flex flex-row gap-1 items-center"
                                        onClick={() => {
                                            setUserId(user.id);
                                            setSearchValue(user.username);
                                            setHideUserList(true);
                                        }}
                                    >
                                        <div className="flex w-10 h-10 rounded-full border border-black items-center justify-center" >{user.username[0].toUpperCase()}</div>
                                        <div>
                                            <div className="text-gray-500" >@{user.username}</div>
                                            <div> - {user.firstname} {user.lastname}</div>
                                        </div>
                                    </li>
                                ))

                            }
                        </ul>
                    )
                }
            </div>

            {/* Filter by Category */}
            <Select
                defaultValue={"All Categories"}
            >
                <SelectTrigger className="w-38 border border-gray-500">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        {
                            [
                                { id: -1, name: "All Categories" },
                                ...category
                            ].map((option, index) => (
                                <SelectItem key={index} value={option.name} onClick={() => setSelectedCategoryId(option.id)}>
                                    {option.name}
                                </SelectItem>
                            ))
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>

            {/* Filter by Payment */}
            <Select
                defaultValue={"Free/Paid"}
            >
                <SelectTrigger className="w-28 border border-gray-500">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Payment</SelectLabel>
                        {
                            [
                                { name: "Free/Paid", value: null },
                                { name: "Free", value: true },
                                { name: "Paid", value: false }
                            ].map((option, index) => (
                                <SelectItem key={index} value={option.name} onClick={() => setIsFree(option.value)}>
                                    {option.name}
                                </SelectItem>
                            ))
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>

            {/* Filter by Type */}
            <Select
                defaultValue={"All Types"}
            >
                <SelectTrigger className="w-28 border border-gray-500">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Types</SelectLabel>
                        {
                            [
                                "All Types",
                                "Online",
                                "Physical"
                            ].map((option, index) => (
                                <SelectItem key={index} value={option} onClick={() => setSelectedType(option)}>
                                    {option}
                                </SelectItem>
                            ))
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>

            <button
                className="bg-teal-500 text-white px-2 py-1 rounded-md hover:bg-teal-600"
                onClick={getSearchEvents}
            >
                Get
            </button>
            <button
                className="bg-yellow-500 text-black px-2 py-1 rounded-md hover:bg-yellow-600"
                onClick={handleReset}
            >
                Reset
            </button>
        </div>
    )
}