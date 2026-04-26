import axios from "axios";

export interface UserInfo {
    id: string;
    username: string;
    firstname: string;
    lastname: string;
}

export async function fetchUsers(info: string) {
    return axios.get(`/api/user/search?info=${info}`)
}

export async function searchAndFilterEvents(searchBy: string, userId: string, searchValue: string, categoryId: number, isFree: boolean | null, type: string) {
    const params = {
        columns: "id, title, description, type, is_free, category_id",
        search: { by: searchBy.toLowerCase(), value: searchBy.toLowerCase() === "title" ? searchValue.toLowerCase() : userId },
        filter: { category_id: categoryId === -1 ? null : categoryId, is_free: isFree, type: type.toLowerCase() == "all types" ? null : type.toLowerCase(), status: null }
    }
    return axios.get(`/api/event`, { params: { query: JSON.stringify(params) } });
}