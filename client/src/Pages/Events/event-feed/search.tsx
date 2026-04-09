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

export default function EventSearchBox() {
    const { categories } = useCategoryStore();
    const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
    const [selectedPaidFilter, setSelectedPaidFilter] = useState<string>("Paid/Free");
    const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("All Type");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchBy, setSearchBy] = useState<string>("title");
    const queryData = useRef<{search: {searchby: string, query: string}, filter: {category: string, paid: string, type: string}}>({
        search: {searchby: "title", query: ""
        },
        filter: {category: "All Categories", paid: "Paid/Free", type: "All Type"}
    });

    const fetchCategories = () => {
        if (categories.length === 0) {
            useCategoryStore.getState().fetchCategories();
        }
    };

    useEffect(() => {
        queryData.current.search.searchby = searchBy;
        queryData.current.search.query = searchQuery;
        queryData.current.filter.category = selectedCategory;
        queryData.current.filter.type = selectedTypeFilter;
        queryData.current.filter.paid = selectedPaidFilter;
        
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
                    <DropdownMenuTrigger className="flex items-center px-3 py-1 rounded-md shadow-md shadow-gray-600 bg-white" onClick={fetchCategories}>{selectedCategory} <ChevronDown /></DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuGroup>
                        <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSelectedCategory("All Categories")}>
                            All Categories
                        </DropdownMenuItem>
                            {
                                categories.map((category) => (
                                    <DropdownMenuItem key={category.id} onClick={() => setSelectedCategory(category.name)}>
                                        {category.name}
                                    </DropdownMenuItem>
                                ))
                            }
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center px-3 py-1 rounded-md shadow-md shadow-gray-600 bg-white" onClick={fetchCategories}>{selectedPaidFilter} <ChevronDown /></DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuGroup>
                        <DropdownMenuLabel>Filter by paid/free</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                            {
                                [
                                    "Paid",
                                    "Free",
                                    "Paid/Free"
                                ].map((filter) => (
                                    <DropdownMenuItem key={filter} onClick={() => setSelectedPaidFilter(filter)}>
                                        {filter}
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