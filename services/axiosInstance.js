  import axios from "axios";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
  const axiosInstance = axios.create({
    baseURL: "http://10.126.91.94:8080/api", // Replace with your backend URL (local IP for testing)
  });
  
  // Add Authorization header with the JWT token if available
  axiosInstance.interceptors.request.use(
    async (config) => {
      const token = await AsyncStorage.getItem("authToken"); // Use AsyncStorage
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  export const setAuthorizationToken = async (token) => {
    if (token) {
      await AsyncStorage.setItem("authToken", token); // Store token in AsyncStorage
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      await AsyncStorage.removeItem("authToken"); // Clear token if needed
      delete axiosInstance.defaults.headers.common["Authorization"];
    }
  };
  
  export default axiosInstance;
  