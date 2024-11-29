import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";
import axios from "axios";
import axiosInstance, { setAuthorizationToken } from "../services/axiosInstance";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      console.log("Sending login request with email:", email, "and password:", password);
      const response = await axios.post(
        `http://10.126.91.94:8080/api/v1/customer/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
      );
      
      const token = response.data; // JWT token returned by the backend
      console.log("User logged in successfully. Token:", token);

      // Store the token and set it for future requests
      await setAuthorizationToken(token);

      // Redirect to Fuel Logs screen
      navigation.navigate("FuelLogs");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message || "Invalid email or password.";
      Alert.alert("Login Failed", errorMessage);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/BG.png")} // Add the background image here
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Please enter your credentials to log in.</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.registerPrompt}>
          Don't have an account?{" "}
          <Text
            style={styles.registerLink}
            onPress={() => navigation.navigate("Register")}
          >
            Register here
          </Text>
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adds a semi-transparent overlay for better readability
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#ddd",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  loginButton: {
    backgroundColor: "#000000",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerPrompt: {
    textAlign: "center",
    marginTop: 10,
    color: "#fff",
  },
  registerLink: {
    color: "#000000",
    fontWeight: "bold",
  },
});


export default LoginScreen;