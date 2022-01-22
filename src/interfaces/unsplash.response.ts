import UnsplashPhoto from "./unsplash.photo";

export default interface UnsplashResponse {
    status: number,
    results: UnsplashPhoto[],
}
