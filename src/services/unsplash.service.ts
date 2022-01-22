import axios from "axios";

import UnsplashResponse from "./../interfaces/unsplash.response";

export default class UnsplashService {
    static async getPhotos(search: string): Promise<UnsplashResponse> {
        const httpClient = axios.create({
            baseURL: "https://api.unsplash.com",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
            },
        });

        
        const response = await httpClient.get(`/search/photos`, {
            params: {
                query: search
            }
        });
        
        return { status: response.status, results: response.data.results };
    }

}