import * as React from "react";
//import useState, useEffect, useCallback, useRef from 'react';
import { useState, useEffect, useRef } from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeBaseProvider, Box } from "native-base";
import Splash from "./screens/Splash";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import AddContact from "./screens/AddContact";
import Dashboard from "./screens/Dashboard";
import Trip from "./screens/Trip";
import Emergency from "./screens/Emergency";
import { LanguageContext, LanguageProvider } from "./context/LanguageContext";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("token: ", token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const [fontsLoaded] = useFonts({
    "Hellix-Bold": require("./assets/fonts/Hellix-Bold.ttf"),
    "Hellix-Light": require("./assets/fonts/Hellix-Light.ttf"),
    "Hellix-Medium": require("./assets/fonts/Hellix-Medium.ttf"),
    "Hellix-Regular": require("./assets/fonts/Hellix-Regular.ttf"),
    "Hellix-SemiBold": require("./assets/fonts/Hellix-SemiBold.ttf"),
    "Hellix-ExtraBold": require("./assets/fonts/Hellix-ExtraBold.ttf"),
    "Hellix-Black": require("./assets/fonts/Hellix-Black.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NativeBaseProvider>
      <LanguageProvider>
        <NavigationContainer>
          <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <Stack.Navigator
              //hide header
              screenOptions={{
                headerShown: false,
              }}
            >
              
              
              <Stack.Screen name="Splash" component={Splash} />

              <Stack.Screen name="Dashboard" component={Dashboard} />
              <Stack.Screen name="AddContact" component={AddContact} />

              
              <Stack.Screen name="Trip" component={Trip} />
              <Stack.Screen name="Emergency" component={Emergency} />
            </Stack.Navigator>
          </View>
        </NavigationContainer>
      </LanguageProvider>
    </NativeBaseProvider>
  );
}

export default App;
