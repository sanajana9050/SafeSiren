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
  Divider,
} from "native-base";
import { Actionsheet } from "native-base";
import { registerTaskAsync, TaskManager } from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications'

import React, { useEffect } from "react";
import { Keyboard, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonDefault from "../components/ButtonDefault";
import Chat from "../components/Chat";
import Icons from "../components/Icons";
import { LanguageContext } from "../context/LanguageContext";

const TASK_NAME = 'FETCH_DATA_TASK';
const NOTIFICATION_ID = 'SOS_NOTIFICATION';

export default function Trip({ navigation, route }) {
  // setup task manager
  
  
  
  //get payload from previous screen
  const payload = route.params;
  

  const { isOpen, onOpen, onClose } = useDisclose();
  const [risk, setRisk] = React.useState(0);
  const [distance, setDistance] = React.useState(0);
  const [time, setTime] = React.useState(0);

  const { isHindi, toggleLanguage } = React.useContext(LanguageContext);

  const fetchData = async (field) => {
    const url = `http://${payload.ipDevice}:3000/` + field;
    const response = await fetch(url, {
      method: "GET",
    });
    const data = await response.json();
    console.log(data);
    

    return data;
  };

  useEffect(() => {
    const timer = setInterval(async () => {
      const risk = await fetchData("risk");
      const distance = await fetchData("distance");
      const time = await fetchData("duration");
      setRisk(risk);
      //round to 2 decimal places
      setDistance(Math.round(distance * 10) / 10000);
      setTime(Math.round(time / 60));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    //TODO: Send notification to user (Vibration, Sound)
    //risk
    if (parseInt(risk) > 70) {
      navigation.navigate("Emergency", {
        ipDevice: payload.ipDevice,
      });
    }
  }, [risk]);

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
          source={require("../assets/images/trip.png")}
          alt="image base"
          resizeMode="contain"
          w="100%"
          h="250"
          position={"absolute"}
          top={90}
          opacity={0.8}
        />
        <VStack space={2} flex={1} w="100%" pt={2}>
          <HStack
            p={8}
            pt={0}
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

          <VStack space={2} flex={1} w="100%" mt={230} pt={0}>
            <RiskMeter risk={risk} />
            <Spacer />
            <VStack bg="gray.100" w="100%" p={8} borderRadius={40}>
              <HStack pb={5} justifyContent={"space-between"}>
                <VStack
                  space={0}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Text
                    fontSize="4xl"
                    textAlign="center"
                    fontFamily={"Hellix-Bold"}
                  >
                    {distance ? distance : "--"} km
                  </Text>
                  <Text
                    fontSize="sm"
                    textAlign="center"
                    fontFamily={"Hellix-SemiBold"}
                    color={"gray.500"}
                    mt={-2}
                  >
                    {/* Remaining Distance */}
                    {isHindi ? "शेष दूरी" : "Remaining Distance"}
                  </Text>
                </VStack>
                <VStack
                  space={0}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Text
                    fontSize="4xl"
                    textAlign="center"
                    fontFamily={"Hellix-Bold"}
                  >
                    {time ? time : "--"} min
                  </Text>
                  <Text
                    fontSize="sm"
                    textAlign="center"
                    fontFamily={"Hellix-SemiBold"}
                    color={"gray.500"}
                    mt={-2}
                  >
                    {/* Time Remaining */}
                    {isHindi ? "शेष समय" : "Time Remaining"}
                  </Text>
                </VStack>
              </HStack>
              <Divider
                orientation="horizontal"
                color={"gray.300"}
                w="100%"
                mb={5}
              />
              <VStack>
                <Text
                  fontSize="sm"
                  textAlign="left"
                  fontFamily={"Hellix-Regular"}
                  color={"gray.500"}
                  mb={2}
                  letterSpacing={4}
                >
                  {/* DRIVER DETAILS */}
                  {isHindi ? "चालक विवरण" : "DRIVER DETAILS"}
                </Text>
                <Text
                  fontSize="lg"
                  textAlign="left"
                  fontFamily={"Hellix-Bold"}
                  color={"gray.800"}
                  mb={0}
                >
                  Rajesh Kumar (OLA)
                </Text>
                <Text
                  fontSize="lg"
                  textAlign="left"
                  fontFamily={"Hellix-Bold"}
                  color={"orange.800"}
                  mb={5}
                >
                  UP16 TC 2908
                </Text>
              </VStack>
              <ButtonDefault
                onPress={() =>
                  navigation.navigate("Emergency", {
                    ipDevice: payload.ipDevice,
                    emergency: true,
                  })
                }
                title="Emergency"
                color="red.500"
              />
            </VStack>
          </VStack>
        </VStack>
      </SafeAreaView>
      <Chat isOpen={isOpen} onClose={onClose} />
    </KeyboardAvoidingView>
  );
}

const RiskMeter = ({ risk }) => {
  const { isHindi, toggleLanguage } = React.useContext(LanguageContext);
  const calculateColor = (risk) => {
    // 0-25 green
    // 25-50 yellow
    // 50-75 orange
    // 75-100 red
    if (risk <= 25) {
      //dark green
      return "#008000";
    } else if (risk <= 50) {
      //dark yellow
      return "#FFB800";
    }
    if (risk <= 75) {
      //dark orange
      return "#FF5C00";
    } else {
      //dark red
      return "#FF0000";
    }
  };
  return (
    <HStack space={5} px={8}>
      {/* Circle red border with shadow and text in the middle */}
      <Box
        w={100}
        h={100}
        borderRadius={100}
        borderWidth={10}
        borderColor={calculateColor(risk)}
        justifyContent={"center"}
        alignItems={"center"}
        style={{
          //red
          shadowColor: calculateColor(risk),
          shadowOpacity: 0.6,
          elevation: 8,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowRadius: 10,
        }}
      >
        <Text
          fontSize="lg"
          textAlign="center"
          fontFamily={"Hellix-Bold"}
          color={calculateColor(risk)}
        >
          {risk}%
        </Text>
      </Box>
      <VStack w="70%">
        <Text
          fontSize="md"
          textAlign="left"
          fontFamily={"Hellix-Bold"}
          color={"#000"}
        >
          {/* Risk Meter */}
          {isHindi ? "रिस्क मीटर" : "Risk Meter"}
        </Text>
        <Text
          fontSize="xs"
          textAlign="left"
          fontFamily={"Hellix-SemiBold"}
          color={"gray.400"}
        >
          {/* The Risk Meter AI model assigns a risk score to the trip based on
          driver behavior and deviation from the optimal path. When the score
          reaches 70%, the emergency sequence is activated. */}
          {isHindi
            ? "रिस्क मीटर एआई मॉडल ट्रिप के लिए एक जोखिम स्कोर निर्धारित करता है ड्राइवर व्यवहार और अनुकूल पथ से विचलन के आधार पर। जब स्कोर 70% पर पहुंच जाता है, तो आपातकालीन अनुक्रम गोल्ड की गई है।"
            : "The Risk Meter AI model assigns a risk score to the trip based on driver behavior and deviation from the optimal path. When the score reaches 70%, the emergency sequence is activated."}

        </Text>
      </VStack>
    </HStack>
  );
};
