import { create } from "zustand";
import api from "@/authentication/public-api";

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
        api.get("/event/categories").then((response) => response.data).then((data) => {
            set({ categories: data });
        }).catch((error) => {
            console.error("Failed to fetch categories:", error);
        });
    }
}));