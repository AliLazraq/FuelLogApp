import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from "react-native";
import axios from "axios";
import ModalSelector from "react-native-modal-selector";
import VehicleSelector from "../components/VehicleSelector";
import axiosInstance from "../services/axiosInstance";

const FuelLogScreen = () => {
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [fuelCost, setFuelCost] = useState("");
  const [fuelAmount, setFuelAmount] = useState(""); // Automatically calculated
  const [location, setLocation] = useState("");
  const [odometer, setOdometer] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [lastOdometer, setLastOdometer] = useState(null);


  // Fetch last odometer value whenever a vehicle is selected
  useEffect(() => {
    if (selectedVehicle) {
      fetchLastOdometer();
    } else {
      setLastOdometer(null); // Reset if no vehicle is selected
    }
  }, [selectedVehicle]);


  const fetchLastOdometer = async (vehicleId) => {
    try {
      if (!vehicleId) {
        
        return;
      }
  
      const response = await axios.get(
        `http://10.126.91.94:8080/api/fuel-logs/latest/${vehicleId}`
      );
  
      const lastOdometer = response.data.odometer; // Default to 0 if undefined
      setLastOdometer(lastOdometer);
      console.log("Last odometer fetched:", lastOdometer);
    } catch (error) {
      console.error("Error fetching last odometer:", error.response || error);
      setLastOdometer(null); // Reset on error
    }
  };  
  
  const validateInputs = () => {
    if (!selectedVehicle) {
      Alert.alert("Error", "Please select a vehicle.");
      return false;
    }
    if (!totalCost || isNaN(totalCost) || parseFloat(totalCost) <= 0) {
      Alert.alert("Error", "Please enter a valid total cost.");
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
    if (lastOdometer !== null && parseInt(odometer) <= lastOdometer) {
      Alert.alert(
        "Error",
        `Odometer value must be greater than the previous value (${lastOdometer}).`
      );
      return false;
    }
    if (!location) {
      Alert.alert("Error", "Please enter a location.");
      return false;
    }
    return true;
  };

  const calculateFuelAmount = (totalCost, fuelCost) => {
    if (totalCost && fuelCost && !isNaN(totalCost) && !isNaN(fuelCost)) {
      return (parseFloat(totalCost) / parseFloat(fuelCost)).toFixed(2);
    }
    return ""; // Return an empty string if invalid
  };

  const handleAddLog = async () => {
    const calculatedFuelAmount = calculateFuelAmount(totalCost, fuelCost); // Calculate dynamically
  
    if (!validateInputs()) return;
  
    try {
      const newLog = {
        vehicleId: selectedVehicle,
        fuelAmount: parseFloat(calculatedFuelAmount), // Use the calculated value
        fuelCost: parseFloat(totalCost), // Save the total cost
        location,
        odometer: parseInt(odometer),
        paymentMethod,
      };
  
      console.log("Sending Fuel Log:", newLog);
      await axios.post("http://10.126.91.94:8080/api/fuel-logs", newLog);
      Alert.alert("Success", "Fuel log added successfully!");
      clearInputs();
    } catch (error) {
      console.error("Error adding fuel log:", error.response || error);
      Alert.alert("Error", "Failed to add fuel log. Please try again.");
    }
  };
  


  const clearInputs = () => {
    setSelectedVehicle("");
    setTotalCost("");
    setFuelCost("");
    setFuelAmount("");
    setLocation("");
    setOdometer("");
    setPaymentMethod("Cash");
    setLastOdometer(null);
  };



  return (
    <ImageBackground
      source={require("../assets/BG.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Add Fuel Log</Text>

        <VehicleSelector
          selectedVehicle={selectedVehicle}
          setSelectedVehicle={(vehicleId) => {
            if (vehicleId) {
              console.log("Vehicle ID selected:", vehicleId); // Debug log
              setSelectedVehicle(vehicleId); // Update state
              fetchLastOdometer(vehicleId); // Fetch odometer for the selected vehicle
            } else {
              
            }
          }}
        />

        <TextInput
          style={styles.input}
          placeholder="Total Cost"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={totalCost}
          onChangeText={(value) => {
            setTotalCost(value);
            calculateFuelAmount(); // Update fuelAmount when totalCost changes
          }}
        />

        <TextInput
          style={styles.input}
          placeholder="Fuel Cost Per Liter"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={fuelCost}
          onChangeText={(value) => {
            setFuelCost(value);
            calculateFuelAmount(); // Update fuelAmount when fuelCost changes
          }}
        />

        <TextInput
          style={styles.input}
          placeholder="Location"
          placeholderTextColor="#999"
          value={location}
          onChangeText={setLocation}
        />

        <TextInput
          style={styles.input}
          placeholder="Odometer"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={odometer}
          onChangeText={setOdometer}
        />

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

        <Button title="Add Fuel Log" onPress={handleAddLog} />
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent overlay
    borderRadius: 10,
    margin: 10,
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
