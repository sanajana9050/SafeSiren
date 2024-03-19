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
import * as LocalAuthentication from 'expo-local-authentication';

import React, { useEffect } from "react";
import { Keyboard, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonDefault from "../components/ButtonDefault";
import Chat from "../components/Chat";
import Icons from "../components/Icons";
import { LanguageContext } from "../context/LanguageContext";


export default function Emergency({ navigation, route }) {
  //get payload from previous screen
  const payload = route.params;
  const [remainingTime, setRemainingTime] = React.useState(45);
  const { isOpen, onOpen, onClose } = useDisclose();
  const [risk, setRisk] = React.useState(0);
  const [distance, setDistance] = React.useState(0);
  const [time, setTime] = React.useState(0);
  const { isHindi, toggleLanguage } = React.useContext(LanguageContext);

  const abnormalPathHeading = "Abnormal Path Detected"
  const abnormalPathHeadingHindi = "असामान्य पथ पाया गया"
  const abnormalPathText = "The driver seems to be taking a longer than expected path."
  const abnormalPathTextHindi = "चालक अपेक्षित से लंबा पथ लेने लग रहा है।"

  const emergencyHeading = "Emergency Initiated"
  const emergencyHeadingHindi = "आप एमर्जेंसी बटन दबा चुके हैं"
  const emergencyText = "You have clicked the emergency button. Click the button below to cancel the emergency."
  const emergencyTextHindi = "आपने एमर्जेंसी बटन दबाया है। एमर्जेंसी रद्द करने के लिए नीचे दिए गए बटन पर क्लिक करें।"
  const abnormalImage = require("../assets/images/abnormal.png")
  const emergencyImage = require("../assets/images/emergency.png")



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
    if (remainingTime <  0) setRemainingTime(0);
    if (remainingTime == 0) {
      return;
    }
    const timer = setInterval(async () => {
      remainingTime > 0 && fetchData("timer").then((data) => {
        setRemainingTime(data);
      });
      
    }, 300);
    return () => clearInterval(timer);
  }, [remainingTime]);

  //triggerSafe
  const triggerSafe = async () => {
    //authenticate
    const { success } = await LocalAuthentication.authenticateAsync();
    if (!success) return;

    const url = `http://${payload.ipDevice}:3000/triggerSafe`;
    const response = await fetch(url, {
      method: "GET",
    });
    //get status code
    const data =  response.status;
    if(data == 200){
      navigation.navigate("Trip", { ipDevice: payload.ipDevice });
    }
  };
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
          backgroundColor: "#D4D4D4",
        }}
        onPress={() => {
          Keyboard.dismiss();
        }}
        onTouchStart={() => {
          Keyboard.dismiss();
        }}
      >
        <Image
          source={payload?.emergency == true ? emergencyImage : abnormalImage}
          alt="image base"
          resizeMode="contain"
          w="100%"
          h="300"
          opacity={1}
          position={"absolute"}
          top={20}
          zIndex={0}
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

          <VStack space={2} flex={1} w="100%" mt={230}  pt={0}
          //liner gradient
          bg="white"
          
          >
            <VStack w="90%" p={8}
              py={-12}
            >
              <Text
                fontSize="4xl"
                mt={-8}
                lineHeight={45}
                textAlign="left"
                fontFamily={"Hellix-Bold"}
                color="#AC0606"
              >
                {/* {payload?.emergency == true ? emergencyHeading : abnormalPathHeading} */}
                {payload?.emergency == true ? isHindi ? emergencyHeadingHindi : emergencyHeading : isHindi ? abnormalPathHeadingHindi : abnormalPathHeading}
              </Text>
              <Text
                fontSize="md"
                mt={2}
                textAlign="left"
                fontFamily={"Hellix-SemiBold"}
                color="gray.500"
              >
                {/* {payload?.emergency == true ? emergencyText : abnormalPathText} */}
                {payload?.emergency == true ? isHindi ? emergencyTextHindi : emergencyText : isHindi ? abnormalPathTextHindi : abnormalPathText}
              </Text>
              <Button mt={8} variant="solid"
                backgroundColor={"#D7EDD9"}
                borderWidth={1}
                borderColor={"gray.300"}
                onPress={() => triggerSafe()}
                w={120}
              >
                <Text fontSize="sm" fontFamily={"Hellix-SemiBold"} color={"#3C5F3F"}>
                  {/* I'm Safe */}
                  {isHindi ? "मैं सुरक्षित हूँ" : "I'm Safe"}
                </Text>
              </Button>
              <Text
                fontSize="xs"
                mt={2}
                mb={4}
                textAlign="left"
                w="90%"
                fontFamily={"Hellix-SemiBold"}
                color="gray.400"
              >
                {/* Click on the 'I'm Safe' button if you are believe this is a false alarm. */}
                {isHindi ? "यदि आप इसे एक गलत अलार्म मानते हैं तो 'मैं सुरक्षित हूँ' बटन पर क्लिक करें।" : "Click on the 'I'm Safe' button if you are believe this is a false alarm."}
              </Text>


            </VStack>

            <Spacer />
            <HStack
              bg="#000"
              w="100%"
              p={8}
              py={10}
              borderRadius={40}
              borderBottomRadius={0}
            >
              <VStack w="50%">
                <Text
                  fontSize="sm"
                  textAlign="left"
                  fontFamily={"Hellix-SemiBold"}
                  color={"#FFF"}
                >
                  Contacting Emergency contacts in
                </Text>
                <Text
                  fontSize="6xl"
                  textAlign="left"
                  fontFamily={"Hellix-ExtraBold"}
                  color={"#FFF"}
                >
                  {remainingTime}s
                </Text>
              </VStack>
              <VStack w="50%" px={8} justifyContent={"center"}>
                <Box
                  w={120}
                  h={120}
                  borderRadius={100}
                  bg={"#DA908C"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  style={{
                    //red
                    shadowColor: "#FF1D0F",
                    shadowOpacity: 0.8,
                    elevation: 8,
                    shadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    shadowRadius: 20,
                  }}
                >
                  <VStack
                    justifyContent={"center"}
                    alignItems={"center"}
                    space={2}
                  >
                    <Icons
                      name="phone-call"
                      size={20}
                      color={"#000"}
                      type={"feather"}
                    />
                    <Text
                      fontSize="xs"
                      textAlign="left"
                      fontFamily={"Hellix-SemiBold"}
                      color={"#000"}
                    >
                      {/* EMERGENCY */}
                      {isHindi ? "आपातकाल" : "EMERGENCY"}
                    </Text>
                  </VStack>
                </Box>
              </VStack>
            </HStack>
          </VStack>
        </VStack>
      </SafeAreaView>
      <Chat isOpen={isOpen} onClose={onClose} />
    </KeyboardAvoidingView>
  );
}

