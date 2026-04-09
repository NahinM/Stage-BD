import { create } from "zustand";
import axios from "axios";

interface Category {
    id: number;
    name: string;
}

interface CategoryState {
    categories: Category[];
    fetchCategories: () => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
    categories: [],
    fetchCategories: async () => {
        axios.get("/api/categories").then((response) => response.data).then((data) => {
            set({ categories: data });
        }).catch((error) => {
            console.error("Failed to fetch categories:", error);
        });
    }
}));