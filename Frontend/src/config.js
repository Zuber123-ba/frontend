const defaultApiUrl = import.meta.env.DEV
	? "http://localhost:4000"
	: "https://frontend-jsrv.onrender.com";
const API_BASE_URL = (import.meta.env.VITE_API_URL || defaultApiUrl).replace(/\/$/, "");

export default API_BASE_URL;
