import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Change port if your backend differs
  withCredentials: true,
});

export default API;
