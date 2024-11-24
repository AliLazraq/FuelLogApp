import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import ModalSelector from "react-native-modal-selector";
import VehicleSelector from "../components/VehicleSelector"; // Custom vehicle selector component
import axiosInstance from "../services/axiosInstance"; // Axios instance for API calls

const FuelLogScreen = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(""); // Selected vehicle state
  const [fuelAmount, setFuelAmount] = useState("");
  const [fuelCost, setFuelCost] = useState("");
  const [location, setLocation] = useState("");
  const [odometer, setOdometer] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash"); // Default payment method

  // Input validation
  const validateInputs = () => {
    if (!selectedVehicle) {
      Alert.alert("Error", "Please select a vehicle.");
      return false;
    }
    if (!fuelAmount || isNaN(fuelAmount) || parseFloat(fuelAmount) <= 0) {
      Alert.alert("Error", "Please enter a valid fuel amount.");
      return false;
    }
    if (!fuelCost || isNaN(fuelCost) || parseFloat(fuelCost) <= 0) {
      Alert.alert("Error", "Please enter a valid fuel cost.");
      return false;
    }
    if (!odometer || isNaN(odometer) || parseInt(odometer) <= 0) {
      Alert.alert("Error", "Please enter a valid odometer reading.");
      return false;
    }
    if (!location) {
      Alert.alert("Error", "Please enter a location.");
      return false;
    }
    return true;
  };

  // Handle submission of fuel log
  const handleAddLog = async () => {
    if (!validateInputs()) return;

    try {
      const newLog = {
        vehicleId: selectedVehicle,
        fuelAmount: parseFloat(fuelAmount),
        fuelCost: parseFloat(fuelCost),
        location,
        odometer: parseInt(odometer),
        paymentMethod,
      };

      console.log("Sending Fuel Log:", newLog); // Debugging log
      await axiosInstance.post("/fuel-logs", newLog);
      Alert.alert("Success", "Fuel log added successfully!");
      clearInputs();
    } catch (error) {
      console.error("Error adding fuel log:", error.response || error);
      Alert.alert("Error", "Failed to add fuel log. Please try again.");
    }
  };

  // Clear input fields after submission
  const clearInputs = () => {
    setSelectedVehicle("");
    setFuelAmount("");
    setFuelCost("");
    setLocation("");
    setOdometer("");
    setPaymentMethod("Cash");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Fuel Log</Text>
      
      {/* Vehicle Selector */}
      <VehicleSelector
        selectedVehicle={selectedVehicle}
        setSelectedVehicle={setSelectedVehicle}
      />

      {/* Fuel Amount Input */}
      <TextInput
        style={styles.input}
        placeholder="Fuel Amount (L)"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={fuelAmount}
        onChangeText={setFuelAmount}
      />

      {/* Fuel Cost Input */}
      <TextInput
        style={styles.input}
        placeholder="Fuel Cost"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={fuelCost}
        onChangeText={setFuelCost}
      />

      {/* Location Input */}
      <TextInput
        style={styles.input}
        placeholder="Location"
        placeholderTextColor="#999"
        value={location}
        onChangeText={setLocation}
      />

      {/* Odometer Input */}
      <TextInput
        style={styles.input}
        placeholder="Odometer"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={odometer}
        onChangeText={setOdometer}
      />

      {/* Payment Method Selector */}
      <View style={styles.selectorContainer}>
        <Text style={styles.label}>Payment Method</Text>
        <ModalSelector
          data={[
            { key: "Cash", label: "Cash" },
            { key: "Credit Card", label: "Credit Card" },
            { key: "Fuel Card", label: "Fuel Card" },
          ]}
          initValue="Select Payment Method"
          onChange={(option) => setPaymentMethod(option.key)}
          style={styles.modalSelector}
          initValueTextStyle={styles.initValueText}
          selectTextStyle={styles.selectText}
        />
      </View>

      {/* Submit Button */}
      <Button title="Add Fuel Log" onPress={handleAddLog} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  selectorContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  modalSelector: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
  initValueText: {
    color: "#999",
  },
  selectText: {
    color: "#000",
  },
});

export default FuelLogScreen;
