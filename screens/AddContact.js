import {
  Text,
  View,
  VStack,
  Image,
  Spacer,
  HStack,
  Box,
  Input,
  KeyboardAvoidingView,
  useToast,
  Heading,
  Divider,
  ScrollView,
} from "native-base";
import React from "react";
import { Keyboard, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonDefault from "../components/ButtonDefault";
import Icons from "../components/Icons";
import ToastAlert from "../components/ToastAlert";
import { LanguageContext } from "../context/LanguageContext";

export default function AddContact({ navigation, route }) {
  const { isHindi, toggleLanguage } = React.useContext(LanguageContext);
  //get payload from previous screen
  const payload = route.params;
  const toast = useToast();
  const [emergencyContactName, setEmergencyContactName] = React.useState("Vishesh");
  const [emergencyContactNumber, setEmergencyContactNumber] =
    React.useState("7014748022");
  // emergencyContactName2 and 3
  const [emergencyContactName2, setEmergencyContactName2] = React.useState("");
  const [emergencyContactNumber2, setEmergencyContactNumber2] =
    React.useState("");

  const [emergencyContactName3, setEmergencyContactName3] = React.useState("");
  const [emergencyContactNumber3, setEmergencyContactNumber3] =
    React.useState("");

  const handleSubmit = async () => {
    //check fields are not empty

    // if (
    //   emergencyContactName === "" ||
    //   emergencyContactNumber === "" ||
    //   emergencyContactName2 === "" ||
    //   emergencyContactNumber2 === "" ||
    //   emergencyContactName3 === "" ||
    //   emergencyContactNumber3 === ""
    // ) {
    //   //toast
    //   toast.show({
    //     render: () => (
    //       <ToastAlert
    //         status="error"
    //         heading="Error"
    //         message="Please fill all the fields"
    //       />
    //     ),
    //   });
    //   return;
    // }
    // //check if phone number is valid
    // if (
    //   emergencyContactNumber.length !== 10 ||
    //   emergencyContactNumber2.length !== 10 ||
    //   emergencyContactNumber3.length !== 10
    // ) {
    //   //toast
    //   toast.show({
    //     render: () => (
    //       <ToastAlert
    //         status="error"
    //         heading="Error"
    //         message="Please enter a valid phone number"
    //       />
    //     ),
    //   });
    //   return;
    // }

    const r1 = await fetch(
      `http://${payload.ipDevice}:3000/emergencyContactName?emergencyContactName=${emergencyContactName}`,
      {
        method: "POST",
      }
    );
    const r2 = await fetch(
      `http://${payload.ipDevice}:3000/emergencyContactNumber?emergencyContactNumber=${emergencyContactNumber}`,
      {
        method: "POST",
      }
    );
    //tripStatus
    const r3 = await fetch(
      `http://${payload.ipDevice}:3000/tripStatus?tripStatus=started`,
      {
        method: "POST",
      }
    );
    if (r1.status === 200 && r2.status === 200 && r3.status === 200) {
      navigation.navigate("Trip", payload);
    } else {
      //toast
      toast.show({
        render: () => (
          <ToastAlert
            status="error"
            heading="Error"
            message="Something went wrong, please try again"
          />
        ),
      });
      //console error
      console.log("Error: ", r1.status, r2.status, r3.status);
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
        }}
        onPress={() => {
          Keyboard.dismiss();
        }}
        onTouchStart={() => {
          Keyboard.dismiss();
        }}
      >
        <Image
          source={require("../assets/images/phone.png")}
          alt="image base"
          resizeMode="contain"
          h="240"
          w="120"
          position={"absolute"}
          bottom={100}
          right={0}
        />

        <VStack space={2} flex={1} w="100%" p={8}>
          <Text
            fontSize="xl"
            w="100%"
            textAlign="left"
            fontFamily={"Hellix-SemiBold"}
            letterSpacing={4}
          >
            SAFESIREN
          </Text>
          
          <Text fontSize="4xl" fontFamily={"Hellix-Bold"} w="90%">
            {/* Emergency Contact details */}
            {isHindi
              ? "एमर्जेंसी संपर्क जानकारी भरें"
              : "Add Emergency Contacts"}
          </Text>
          <Text fontSize="md" fontFamily={"Hellix-SemiBold"} color={"gray.500"}>
            {/* Please fill the contact info of your emergency contact, we will use
          this to message them in case of an emergency. */}
            {isHindi
              ? "कृपया अपने आपातकालीन संपर्क की संपर्क जानकारी भरें, आपात स्थिति में हम इसका उपयोग उन्हें संदेश भेजने के लिए करेंगे।"
              : "Please fill the contact info of your emergency contacts, we will use this to message them in case of an emergency."}
          </Text>
          
          <ScrollView style={{ width: "100%", flex: 1 }}
            mt={4}
          >
            <VStack space={2} flex={1} w="100%" >
            <Heading size="sm" fontFamily={"Hellix-Bold"} w="100%">
              {/* Contact 1 */}
              {isHindi ? "संपर्क 1" : "Contact 1"}
            </Heading>
            <Input
              placeholder={
                //  "Name"
                isHindi ? "नाम" : "Name"
              }
              p={4}
              fontFamily={"Hellix-SemiBold"}
              fontSize="lg"
              //autocomplete="off"
              autoCapitalize="none"
              value={emergencyContactName}
              onChangeText={setEmergencyContactName}
              autoCorrect={false}
              mb={3}
              backgroundColor={"#F2F2F2"}
            />
            <Input
              placeholder={
                // "SOS Phone Number"
                isHindi ? "संपर्क फोन नंबर" : "SOS Phone Number"
              }
              p={4}
              type="number"
              keyboardType="numeric"
              fontFamily={"Hellix-SemiBold"}
              fontSize="lg"
              //autocomplete="off"
              autoCapitalize="none"
              value={emergencyContactNumber}
              onChangeText={setEmergencyContactNumber}
              autoCorrect={false}
              backgroundColor={"#F2F2F2"}
            />
            <Divider my={2} />
            <Heading size="sm" fontFamily={"Hellix-Bold"} w="100%">
              {/* Contact 1 */}
              {isHindi ? "संपर्क 2" : "Contact 2"}
            </Heading>
            <Input
              placeholder={
                //  "Name"
                isHindi ? "नाम" : "Name"
              }
              p={4}
              fontFamily={"Hellix-SemiBold"}
              fontSize="lg"
              //autocomplete="off"
              autoCapitalize="none"
              value={emergencyContactName2}
              onChangeText={setEmergencyContactName2}
              autoCorrect={false}
              mb={3}
              backgroundColor={"#F2F2F2"}
            />
            <Input
              placeholder={
                // "SOS Phone Number"
                isHindi ? "संपर्क फोन नंबर" : "SOS Phone Number"
              }
              p={4}
              type="number"
              keyboardType="numeric"
              fontFamily={"Hellix-SemiBold"}
              fontSize="lg"
              //autocomplete="off"
              autoCapitalize="none"
              value={emergencyContactNumber2}
              onChangeText={setEmergencyContactNumber2}
              autoCorrect={false}
              backgroundColor={"#F2F2F2"}
            />
            <Divider my={2} />
            <Heading size="sm" fontFamily={"Hellix-Bold"} w="100%">
              {/* Contact 1 */}
              {isHindi ? "संपर्क 3" : "Contact 3"}
            </Heading>
            <Input
              placeholder={
                //  "Name"
                isHindi ? "नाम" : "Name"
              }
              p={4}
              fontFamily={"Hellix-SemiBold"}
              fontSize="lg"
              //autocomplete="off"
              autoCapitalize="none"
              value={emergencyContactName3}
              onChangeText={setEmergencyContactName3}
              autoCorrect={false}
              mb={3}
              backgroundColor={"#F2F2F2"}
            />
            <Input
              placeholder={
                // "SOS Phone Number"
                isHindi ? "संपर्क फोन नंबर" : "SOS Phone Number"
              }
              p={4}
              type="number"
              keyboardType="numeric"
              fontFamily={"Hellix-SemiBold"}
              fontSize="lg"
              //autocomplete="off"
              autoCapitalize="none"
              value={emergencyContactNumber3}
              onChangeText={setEmergencyContactNumber3}
              autoCorrect={false}
              backgroundColor={"#F2F2F2"}
            />
            </VStack>
            
          </ScrollView>

          

          <ButtonDefault
            onPress={() => handleSubmit()}
            title={
              // "Continue"
              isHindi ? "जारी रखें" : "Continue"
            }
            color="#5F8D96"
          />
        </VStack>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
