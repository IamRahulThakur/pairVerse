import axios from "axios";

export const BASEURL =
  location.hostname === "localhost"
    ? "http://localhost:3000/" 
    : import.meta.env.VITE_API_URL; 
export const api = axios.create({
  baseURL: BASEURL,
  withCredentials: true,
});
