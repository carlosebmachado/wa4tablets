import React, { useState, useEffect } from "react";
import { SafeAreaView, StatusBar } from "react-native";

import * as MediaLibrary from "expo-media-library";
import { Camera } from "expo-camera";
import { Audio } from "expo-av";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { colors } from "./src/constants";

import Home from "./src/views/Home";

const Stack = createNativeStackNavigator();

export default function App() {
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState(false);
  const [audioPermission, setAudioPermission] = useState(false);

  useEffect(() => {
    async function requestMediaLibraryPermission() {
      if (mediaLibraryPermission) return;
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === MediaLibrary.PermissionStatus.GRANTED) {
          setMediaLibraryPermission(true);
          console.info("Media library permission granted");
        }
      } catch (err) {
        console.error("Failed to get media library permissions", err);
      }
    }

    async function requestCameraPermission() {
      if (cameraPermission && microphonePermission) return;
      try {
        const cameraPermissions = await Camera.requestCameraPermissionsAsync();
        const microphonePermissions = await Camera.requestMicrophonePermissionsAsync();
        if (cameraPermissions.granted) {
          setCameraPermission(true);
          console.info("Camera permission granted");
        }
        if (microphonePermissions.granted) {
          setMicrophonePermission(true);
          console.info("Microphone permission granted");
        }
      } catch (err) {
        console.error("Failed to get camera and microphone permissions", err);
      }
    }

    async function requestAudioPermission() {
      if (audioPermission) return;
      try {
        const { status } = await Audio.requestPermissionsAsync();
        if (status === Audio.PermissionStatus.GRANTED) {
          setAudioPermission(true);
          console.info("Audio permission granted");
        }
      } catch (err) {
        console.error("Failed to get audio permissions", err);
      }
    }

    if (!mediaLibraryPermission) {
      requestMediaLibraryPermission();
    }

    if (!cameraPermission) {
      requestCameraPermission();
    }

    if (!audioPermission) {
      requestAudioPermission();
    }
  }, [mediaLibraryPermission, cameraPermission, audioPermission]);

  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor={colors.tealGreenDark} />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}
