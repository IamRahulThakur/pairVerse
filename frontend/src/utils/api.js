import axios from "axios";

export const BASEURL = import.meta.env.VITE_API_URL;


export const api = axios.create({
  baseURL: BASEURL,
  withCredentials: true,
});

