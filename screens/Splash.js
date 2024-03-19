import { Text, View, VStack, Image, Spacer, HStack, Box } from "native-base";
import React from "react";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonDefault from "../components/ButtonDefault";
import Icons from "../components/Icons";
import { LanguageContext } from "../context/LanguageContext";

export default function Splash({ navigation}) {
  const { isHindi, toggleLanguage } = React.useContext(LanguageContext);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      }}
    >
      <VStack space={2} flex={1} w="100%" p={8}>
        <HStack
          justifyContent="space-between"
          w="100%"
          alignItems="center"

        >
          <Text
            fontSize="xl"
            
            textAlign="left"
            fontFamily={"Hellix-SemiBold"}
            letterSpacing={4}
          >
            SAFESIREN
          </Text>
          <TouchableOpacity onPress={() => toggleLanguage()}>
            <Text
              fontSize="md"
              
              textAlign="right"
              fontFamily={"Hellix-SemiBold"}
              
            >
              {isHindi ? "Eng" : "हिंदी"}
            </Text>
          </TouchableOpacity>
        </HStack>
        
        <Image
          source={require("../assets/images/splash.png")}
          alt="image base"
          resizeMode="contain"
          w="100%"
          h="300"
        />
        {!isHindi && <Text fontSize="4xl" fontFamily={"Hellix-Bold"} w="90%">
          Never feel <Text color={"red.500"}>{"\n"}unsafe </Text>
          while traveling alone. 
          

        </Text> 
        }
        {isHindi && <Text fontSize="4xl" fontFamily={"Hellix-Bold"} w="90%">
          अकेले यात्रा करते समय कभी भी असुरक्षित नहीं लगेंगे।
        </Text>
        }


        <Text fontSize="md" fontFamily={"Hellix-SemiBold"} color={"gray.500"}>
          {/* Our state of the art AI automatically detects driver anomalies and
          notify you and your contacts before it's too late. */}
          {isHindi ? "हमारी अधुनिक एआई ड्राइवर अनोमलियों को स्वचालित रूप से पता लगाती है और यह आप और आपके संपर्कों को बताती है कि यह बहुत देर हो गया है।" : "Our state of the art AI automatically detects driver anomalies and notify you and your contacts before it's too late."}

        </Text>
        <Spacer></Spacer>
        <ButtonDefault
          onPress={() => navigation.navigate("Dashboard")}
          title={isHindi ? "शुरू करें" : "Get Started"}
          color="#5F8D96"
        />
      </VStack>
    </SafeAreaView>
  );
}
