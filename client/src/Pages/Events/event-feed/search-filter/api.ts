import axios from "axios";

export interface UserInfo {
    id: string;
    username: string;
    firstname: string;
    lastname: string;
}

export async function fetchUsers(info: string) {
    return axios.get(`/api/user/info?info=${info}`)
}

export async function searchAndFilterEvents (searchBy: string,userId: string, searchValue: string, categoryId: number, isFree: boolean | null, type: string) {
    const params = {
        searchBy: searchBy.toLowerCase(),
        userId: userId,
        searchValue: searchValue,
        categoryId: categoryId,
        isFree: isFree,
        type: type.toLowerCase()
    }
    console.log("Search and filter params: ", params);
    return axios.post(`/api/searchevents`, { data:params });
}