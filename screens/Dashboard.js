import {
  Text,
  View,
  VStack,
  Image,
  Spacer,
  HStack,
  Box,
  KeyboardAvoidingView,
  Input,
  Button,
  useDisclose,
  ScrollView,
  Spinner,
  useToast,
} from "native-base";
import { Actionsheet } from "native-base";
import { Linking } from "react-native";

import React, { useEffect } from "react";
import { Keyboard, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonDefault from "../components/ButtonDefault";
import Chat from "../components/Chat";
import Icons from "../components/Icons";
import * as Clipboard from "expo-clipboard";
import ToastAlert from "../components/ToastAlert";

import NetInfo from "@react-native-community/netinfo";
import { LanguageContext } from "../context/LanguageContext";

// Function to get the IP address of the device
const getIPAddress = async () => {
  const details = await NetInfo.fetch();
  console.log(details);
  const ipAddress = details.details.ipAddress;
  return ipAddress;
};
// Function to scan for devices on the network


export default function Dashboard({ navigation}) {
  const { isOpen, onOpen, onClose } = useDisclose();
  const [origin, setOrigin] = React.useState("");
  const [destination, setDestination] = React.useState("");
  const toast = useToast();
  const [loading, setLoading] = React.useState(false);
  const [driverDetails, setDriverDetails] = React.useState(null);

  const { isHindi, toggleLanguage } = React.useContext(LanguageContext);

  const [ipDevices, setIpDevices] = React.useState([
    //remove this if needed
    "192.168.2.63"
  ]);
  // Function to open the Shortcuts app and launch a specific shortcut

  const fetchCopiedText = async () => {
    const text = await Clipboard.getStringAsync();
    console.log(text);
    return text;
  };

  useEffect(() => {
    if(ipDevices.length === 0){
      scanForDevices();
    }
      
  }, []);

  const scanForDevices = async () => {
    const ipAddress = await getIPAddress(); // Get the IP address of the device
  
    const ipPrefix = ipAddress.substring(0, ipAddress.lastIndexOf('.')); // Get the IP prefix of the device
    const devices = [];
  
    // Scan for devices on the same network
    for (let i = 1; i <= 255; i++) {
      const ip = `${ipPrefix}.${i}`;
      console.log(`Scanning device ${ip}`);
      // Skip the IP address of the device running the app
      if (ip === ipAddress) {
        continue;
      }
  
      try {
        // Try to make a test API call to the device
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 100); // Set a timeout of 1 second
  
        const response = await fetch(`http://${ip}:3000/`, { signal: controller.signal });
        clearTimeout(timeoutId);
  
        if (response.ok) {
          console.log(`Found device at ${ip}`);
          devices.push(ip);
          break;
        }
      } catch (error) {
        // Handle any errors that occur during the API call
        console.log(`Error scanning device ${ip}: ${error.message}`);
      }
    }
  
    setIpDevices(devices);
  };


  const launchShortcut = async () => {
    console.log("clicked");
    setLoading(true);
    //timeout 3 seconds
    setTimeout(() => {
      setLoading(false);
      setDriverDetails("Aman Sharma\nRJ14TD8874\nWhite Elon");
    }
    , 3000);
    return;
    setLoading(true);
    const scheme = "shortcuts://";
    const shortcutName = "Get OLA Details";

    // Check if the Shortcuts app is installed on the user's device
    const isShortcutsInstalled = await Linking.canOpenURL(scheme);

    if (isShortcutsInstalled) {
      // Open the Shortcuts app with the desired shortcut
      const shortcutURL = `${scheme}run-shortcut?name=${encodeURIComponent(
        shortcutName
      )}`;
      await Linking.openURL(shortcutURL);

      // check every 2 seconds for 16 seconds
      var i = 0;
      const interval = setInterval(async () => {
        const text = await fetchCopiedText();
        if (text) {
          clearInterval(interval);
          setLoading(false);
          setDriverDetails(text);
        }
        if (i > 8) {
          clearInterval(interval);
          setLoading(false);
          setDriverDetails(null);
          toast.show({
            render: () => (
              <ToastAlert
                status="error"
                heading="Error"
                message={"Could not fetch driver details"}
              />
            ),
          });
        }
        i++;
      }, 2000);
    } else {
      // Handle the case where the Shortcuts app is not installed
      console.warn("The Shortcuts app is not installed on this device.");
    }
  };

  const beginJourney = async () => {
    //sample request = http://localhost:3000/origin?origin=Hello pg
    if(!origin || !destination) {
      toast.show({
        render: () => (
          <ToastAlert
            status="error"
            heading="Error"
            message={"Please enter origin and destination" }
          />
        ),
      });
      return;
    }
    //check driver details
    if(!driverDetails) {
      toast.show({
        render: () => (
          <ToastAlert

            status="error"
            heading="Error"
            message={"Please fetch driver details" }
          />
        ),
      });

      return;
    }


    if(!ipDevices.length) {
      toast.show({
        render: () => (
          <ToastAlert
            status="error"
            heading="Error"
            message={"No devices found on the network" }
          />
        ),
      });
      return;
    }
    const devices = ipDevices;
    const url = `http://${devices[0]}:3000/origin?origin=` + origin;
    const resOrigin = await fetch(url, {
      method: "POST",
    })

    const url2 = `http://${devices[0]}:3000/destination?destination=` + destination;
    const resDestination = await fetch(url2, {
      method: "POST",
    })

    const url3 = `http://${devices[0]}:3000/driverDetails?driverDetails=` + driverDetails;
    const resDriverDetails = await fetch(url3, {
      method: "POST",
    })




    if (resOrigin.status === 200 && resDestination.status === 200 && resDriverDetails.status === 200) {
      navigation.navigate("AddContact", { ipDevice: devices[0] });
    }
    else{
      toast.show({
        render: () => (
          <ToastAlert
            status="error"
            heading="Error"
            message={"Something went wrong"}
          />
        ),
      });
      console.log("Error " + resOrigin.status + " " + resDestination.status + " " + resDriverDetails.status);
    }




  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          backgroundColor: "#FFF",
        }}
        onPress={() => {
          Keyboard.dismiss();
        }}
        onTouchStart={() => {
          Keyboard.dismiss();
        }}
      >
        <Image
          source={require("../assets/images/whereto.png")}
          alt="image base"
          resizeMode="contain"
          w="100%"
          h="350"
          position={"absolute"}
          top={70}
          opacity={0.8}
        />
        <VStack space={2} flex={1} w="100%" p={8} pt={2}>
          <HStack
            justifyContent={"space-between"}
            w="100%"
            alignItems={"center"}
          >
            <Text
              fontSize="xl"
              textAlign="left"
              fontFamily={"Hellix-SemiBold"}
              letterSpacing={4}
            >
              SAFESIREN
            </Text>

            <Button
              onPress={() => {
                onOpen();
              }}
              variant="solid"
              backgroundColor={"#5F8D96"}
              borderRadius={"full"}
              px={5}
              startIcon={
                <Icons
                  name="message-circle"
                  size={20}
                  color={"#FFF"}
                  type={"feather"}
                />
              }
            >
              <Text fontSize="sm" fontFamily={"Hellix-SemiBold"} color={"#FFF"}>
                {/* Talk to Shakti */}
                {isHindi ? "शक्ति से बात करें" : "Talk to Shakti"}
              </Text>
            </Button>
          </HStack>

          <Text fontSize="4xl" mt={220} fontFamily={"Hellix-Bold"} w="90%">
            {/* Where to? */}
            {isHindi ? "कहां जाना है?" : "Where to?"}
          </Text>
          <Input
            placeholder={
              // "Enter pickup location"
              isHindi ? "पिकअप स्थान दर्ज करें" : "Enter pickup location"
            }
            p={4}
            mt={3}
            fontFamily={"Hellix-SemiBold"}
            fontSize="lg"
            //autocomplete="off"
            value={origin}
            onChangeText={(text) => setOrigin(text)}
            autoCapitalize="none"
            autoCorrect={false}
            mb={3}
            backgroundColor={"#F2F2F2"}
          />
          <Input
            placeholder={
              //"Enter destination"
              isHindi ? "गंतव्य दर्ज करें" : "Enter destination"
            }
            p={4}
            value={destination}
            onChangeText={(text) => setDestination(text)}
            
            fontFamily={"Hellix-SemiBold"}
            fontSize="lg"
            //autocomplete="off"
            autoCapitalize="none"
            autoCorrect={false}
            backgroundColor={"#F2F2F2"}
          />

          <Spacer />
          {driverDetails ? (
            <VStack
              borderRadius={"xl"}
              overflow="hidden"
              bg={"#F2F2F2"}
              p={4}
            >
              <Text
                //monospace
                mb={3}
                fontSize="lg"
                fontWeight={"bold"}
              >
                {/* Driver Details */}
                {isHindi ? "ड्राइवर विवरण" : "Driver Details"}
              </Text>
            <Text
              fontSize="md"
              fontFamily={"Hellix-Medium"}
              color={"gray.700"}
              
              
            >
              {driverDetails}
            </Text>
            </VStack>
          ) : (
            <VStack
              w="100%"
              bg="#F2F2F2"
              borderRadius={10}
              p={4}
              space={0}
              borderWidth={1}
              borderColor={"gray.300"}
            >
              <Text fontSize="lg" fontFamily={"Hellix-Bold"}>
                {/* Fetch driver details */}
                {isHindi ? "ड्राइवर विवरण लाएं" : "Fetch driver details"}
              </Text>
              <Text
                fontSize="sm"
                fontFamily={"Hellix-SemiBold"}
                color={"gray.500"}
              >
                {/* Select the app you are using for your trip. */}
                {isHindi ? "अपनी यात्रा के लिए आप जिस ऐप का उपयोग कर रहे हैं उसे चुनें।" : "Select the app you are using for your trip."}
              </Text>
              {loading ? (
                <Spinner />
              ) : (
                <HStack
                  mt={2}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <TouchableOpacity
                    onClick={() => {
                      
                    }}
                  >
                    <Image
                      source={require("../assets/images/uber.png")}
                      alt="image base"
                      height={20}
                      width={20}
                      resizeMode="contain"
                    ></Image>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      launchShortcut();
                    }}
                  >
                    <Image
                      source={require("../assets/images/ola.png")}
                      alt="image base"
                      //objectFit="cover"
                      height={20}
                      width={20}
                      resizeMode="contain"
                    ></Image>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Image
                      source={require("../assets/images/rapido.png")}
                      alt="image base"
                      height={"45px"}
                      width={20}
                      resizeMode="contain"
                    ></Image>
                  </TouchableOpacity>
                </HStack>
              )}
            </VStack>
          )}
          <Spacer />
          <ButtonDefault
            onPress={beginJourney}
            title="Begin Journey"
            color="#000"
          />
        </VStack>
      </SafeAreaView>
      <Chat isOpen={isOpen} onClose={onClose} />
    </KeyboardAvoidingView>
  );
}
