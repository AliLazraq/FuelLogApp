import React, { useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  ImageBackground,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axiosInstance from "../services/axiosInstance";

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    dob: "",
    password: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleRegister = async () => {
    try {
      await axios.post("http://10.126.91.94:8080/api/v1/customer/add", formData);
      Alert.alert("Success", "Registration successful!");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert(
        "Registration Failed",
        error.response?.data?.message || "Failed to register. Please check your details."
      );
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      handleChange("dob", formattedDate);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/BG.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formBox}>
          <Text style={styles.title}>Create an Account</Text>
          <Text style={styles.subtitle}>
            Please fill in the form below to create an account.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#999"
            value={formData.firstname}
            onChangeText={(text) => handleChange("firstname", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#999"
            value={formData.lastname}
            onChangeText={(text) => handleChange("lastname", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: formData.dob ? "#000" : "#999" }}>
              {formData.dob || "Date of Birth (YYYY-MM-DD)"}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={formData.dob ? new Date(formData.dob) : new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              maximumDate={new Date()}
              onChange={handleDateChange}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
            secureTextEntry
          />
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
          <Text style={styles.loginPrompt}>
            Already have an account?{" "}
            <Text
              style={styles.loginLink}
              onPress={() => navigation.navigate("Login")}
            >
              Login here
            </Text>
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", // Aligns the content horizontally in the center
  },
  container: {
    flexGrow: 1, // Ensures content takes up the full screen height for proper centering
    justifyContent: "center", // Centers the content vertically
    alignItems: "center", // Centers the content horizontally
    padding: 20,
  },
  formBox: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent background
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // Adds shadow for Android
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
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
  registerButton: {
    backgroundColor: "#000000",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  registerButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginPrompt: {
    textAlign: "center",
    marginTop: 10,
    color: "#555",
  },
  loginLink: {
    color: "#00000",
    fontWeight: "bold",
  },
});

export default RegisterScreen;

