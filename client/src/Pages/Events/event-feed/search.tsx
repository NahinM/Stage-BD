import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useCategoryStore } from "@/store/category"
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { setEvents, fetchEvents, events } from "@/store/Events/event-store.ts";

export default function EventSearchBox() {
    const { categories } = useCategoryStore();
    const [selectedCategory, setSelectedCategory] = useState<number>(-1);
    const [selectedPaidFilter, setSelectedPaidFilter] = useState<boolean | null>(null);
    const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("All Type");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchBy, setSearchBy] = useState<string>("title");
    const queryData = useRef<{search: {searchby: string, query: string}, filter: {category: number, paid: boolean | null, type: string}}>({
        search: {searchby: "title", query: ""
        },
        filter: {category: -1, paid: null, type: "All Type"}
    });

    const fetchCategories = () => {
        if (categories.length === 0) {
            useCategoryStore.getState().fetchCategories();
        }
    };

    useEffect(() => {
        if(selectedCategory === -1 && selectedPaidFilter === null && selectedTypeFilter === "All Type" && searchQuery.trim() === "") {
            if(events.length === 0) {
                fetchEvents();
            }
            return;
        }
        queryData.current.search.searchby = searchBy;
        queryData.current.search.query = searchQuery;
        queryData.current.filter.category = selectedCategory;
        queryData.current.filter.type = selectedTypeFilter;
        queryData.current.filter.paid = selectedPaidFilter;
        axios.post("/api/searchevents", queryData.current).then(response => {
            setEvents(response.data);
            console.log("Search results:", response.data);
        }).catch(error => {
            console.error("Search error:", error);
        });
    }, [searchBy, searchQuery, selectedCategory, selectedPaidFilter, selectedTypeFilter]);

    return (
        <div className="p-5 flex flex-row items-center gap-2 bg-gray-300 rounded-md shadow-md mb-6">
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center px-3 py-1 rounded-md shadow-md shadow-gray-600 bg-white" onClick={fetchCategories}>search by: {searchBy} <ChevronDown /></DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuGroup>
                        <DropdownMenuLabel>search by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                            {
                                [
                                    "title",
                                    "organizer"
                                ].map((filter) => (
                                    <DropdownMenuItem key={filter} onClick={() => setSearchBy(filter)}>
                                        {filter}
                                    </DropdownMenuItem>
                                ))
                            }
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Search events..."
                    className="border border-gray-300 rounded-md py-1 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md shadow-gray-600 bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center px-3 py-1 rounded-md shadow-md shadow-gray-600 bg-white" onClick={fetchCategories}>{categories.find(c => c.id === selectedCategory)?.name || "All Categories"} <ChevronDown /></DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuGroup>
                        <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSelectedCategory(-1)}>
                            All Categories
                        </DropdownMenuItem>
                            {
                                categories.map((category) => (
                                    <DropdownMenuItem key={category.id} onClick={() => setSelectedCategory(category.id)}>
                                        {(category.id===-1 ? "All Categories" : category.name)}
                                    </DropdownMenuItem>
                                ))
                            }
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center px-3 py-1 rounded-md shadow-md shadow-gray-600 bg-white" onClick={fetchCategories}>{selectedPaidFilter === true ? "Paid" : selectedPaidFilter === false ? "Free" : "Paid/Free"} <ChevronDown /></DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuGroup>
                        <DropdownMenuLabel>Filter by paid/free</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                            {
                                [
                                    true,
                                    false,
                                    null
                                ].map((filter,index) => (
                                    <DropdownMenuItem key={index} onClick={() => setSelectedPaidFilter(filter)}>
                                        {filter === true ? "Paid" : filter === false ? "Free" : "Paid/Free"}
                                    </DropdownMenuItem>
                                ))
                            }
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center px-3 py-1 rounded-md shadow-md shadow-gray-600 bg-white" onClick={fetchCategories}>{selectedTypeFilter} <ChevronDown /></DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuGroup>
                        <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                            {
                                [
                                    "Online",
                                    "physical",
                                    "All Type"
                                ].map((filter) => (
                                    <DropdownMenuItem key={filter} onClick={() => setSelectedTypeFilter(filter)}>
                                        {filter}
                                    </DropdownMenuItem>
                                ))
                            }
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}