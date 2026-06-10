import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  // baseURL: "http://192.168.1.5:5000/api", // 👈 for Mobile frontend URL
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;