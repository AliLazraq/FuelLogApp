import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import ModalSelector from "react-native-modal-selector";
import axiosInstance from "../services/axiosInstance";
import axios from "axios";

const VehicleSelector = ({ selectedVehicle, setSelectedVehicle }) => {
  const [vehicles, setVehicles] = useState([]);
  const [formattedVehicles, setFormattedVehicles] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axiosInstance.get("http://10.126.91.94:8080/api/vehicles");
        const vehicleData = response.data || [];
        setVehicles(vehicleData);
        setFormattedVehicles(
          vehicleData.map((vehicle) => ({
            key: vehicle.vehicleId,
            label: `${vehicle.make} (${vehicle.plateNumber})`,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
        setVehicles([]);
      }
    };
    fetchVehicles();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Vehicle</Text>
      <ModalSelector
        data={formattedVehicles}
        initValue="Select a Vehicle"
        onChange={(option) => {
          console.log("Vehicle selected from ModalSelector:", option);
          setSelectedVehicle(option.key);
        }}
        style={styles.selector}
        initValueTextStyle={styles.initValueText}
        selectTextStyle={styles.selectText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  selector: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    padding: 10,
  },
  initValueText: {
    color: "#555",
  },
  selectText: {
    color: "#000",
  },
});

export default VehicleSelector;
