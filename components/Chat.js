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
} from "native-base";
import { Actionsheet } from "native-base";
import React, { useRef, useState } from "react";
import { Keyboard, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonDefault from "../components/ButtonDefault";

import Icons from "../components/Icons";

import { useEffect } from "react";
import { KeyboardEvent } from "react-native";

export const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    function onKeyboardDidShow(e) {
      // Remove type here if not using TypeScript
      setKeyboardHeight(e.endCoordinates.height);
    }

    function onKeyboardDidHide() {
      setKeyboardHeight(0);
    }

    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      onKeyboardDidShow
    );
    const hideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      onKeyboardDidHide
    );
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return keyboardHeight;
};

const UserChatBubble = ({ message }) => {
  return (
    <Box
      p={3}
      maxW={"90%"}
      bg={"#5F8D96"}
      borderRadius={"xl"}
      alignSelf={"flex-end"}
      justifyContent={"center"}
      alignItems={"center"}
      px={6}
      mb={4}
    >
      <Text
        fontSize="lg"
        fontFamily={"Hellix-SemiBold"}
        maxW={"100%"}
        textAlign="right"
        borderRadius={10}
        color={"#FFF"}
        multiline={true}
      >
        {message}
      </Text>
    </Box>
  );
};

const ShaktiChatBubble = ({ message }) => {
  return (
    <Box
      p={3}
      maxW={"90%"}
      bg={"gray.200"}
      borderRadius={"xl"}
      alignSelf={"flex-start"}
      justifyContent={"center"}
      alignItems={"center"}
      px={6}
      mb={4}
    >
      <Text
        fontSize="lg"
        fontFamily={"Hellix-SemiBold"}
        maxW={"100%"}
        textAlign="left"
        borderRadius={10}
        color={"gray.800"}
        multiline={true}
      >
        {message}
      </Text>
    </Box>
  );
};

export default function Chat({ isOpen, onClose }) {
  //isFocused = true;
  const [isFocused, setIsFocused] = useState(false);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  //scrollview ref
  const scrollViewRef = useRef();
  //scroll to bottom
  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const [conversation, setConversation] = useState([
    {
      content:
        "Hi, I am Shakti. Your personal safety assistant. I am here to help you with your safety needs while travelling. How can I help you?",
      role: "assistant",
    },
  ]);
  const keyboardHeight = useKeyboard();

  const handleSend = () => {
    if (message) {
      Keyboard.dismiss();
      var conversationCopy = [...conversation];
      conversationCopy.push({
        content: message,
        role: "user",
      });
      
      setConversation(conversationCopy);
      setMessage("");

      //api call
      setTyping(true);

      console.log("typing", conversationCopy);
      const OPENAI_API_KEY =
        "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";

      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a chatbot named Shakti for an app named SafeSiren about women's safety while traveling in cabs. Your task is to the make them aware of the app's features and try to help them if they are in any dangerous situation by giving them safety tips based on their situation.

                App's functionality:
                The app is designed to detect any deviation of the driver from the intended route towards the destination. It assigns a risk level based on the path taken, speed, and whether the brakes are applied abruptly. The app then warns the traveler of potential dangers and alerts emergency contacts if there is no response within 30 seconds. 
                Additionally, the app provides an emergency button to send instant messages to the user's emergency contacts.
                
                Make sure to not mention any extra features that are not mentioned in the app functionality above.`,
            },
            ...conversationCopy,
          ],
          temperature: 0.7,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          var conversationX = [...conversationCopy];
          conversationX.push({
            content: data.choices[0].message.content,
            role: "assistant",
          });
          scrollToBottom();
          setConversation(conversationX);
          setTyping(false);
        })
        .catch((error) => {
          console.error(error);
          setTyping(false);
        });
        scrollToBottom();
    }
  };
  return (
    <Actionsheet
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      placement="bottom"
    >
      {/* header */}

      <Actionsheet.Content bg={"#5F8D96"} p={0}>
        <VStack w={"100%"} space={0}>
          <HStack
            w="100%"
            bg="#5F8D96"
            px={4}
            pt={2}
            pb={0}
            alignItems={"center"}
            space={2}
          >
            <Spacer />
            <Icons name="verified" size={20} color={"#FFF"} type={"material"} />
            <Text
              fontSize="xl"
              fontFamily={"Hellix-Bold"}
              color={"#FFF"}
              textAlign="center"
            >
              Shakti is here to help
            </Text>
            <Spacer />
          </HStack>
          {/* typing text */}
          <Text
            fontSize="sm"
            fontFamily={"Hellix-Medium"}
            maxW={"100%"}
            textAlign="center"
            mb={-2}
            color={"#FFF"}
          >
            {typing ? "typing..." : " "}
          </Text>
        </VStack>
        <Box w="100%" bg="#FFF" h={100} position={"absolute"} bottom={0}></Box>
        <ScrollView
          w={"100%"}
          ref={scrollViewRef}
            onContentSizeChange={scrollToBottom}
          mt={5}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            backgroundColor: "#FFF",
          }}
        >
          <VStack minH={300} w={"100%"} p={3} pb={100}>
            {conversation.map((item, index) => {
              if (item.role === "user") {
                return <UserChatBubble message={item.content} key={index} />;
              } else {
                return <ShaktiChatBubble message={item.content} key={index} />;
              }
            })}
          </VStack>
        </ScrollView>
        <HStack
          p={4}
          mt={3}
          mx={4}
          position={"absolute"}
          bottom={10}
          w={"100%"}
          space={2}
          justifyContent="center"
          alignItems="center"
          bg={"#FFF"}
          borderRadius={20}
          pb={isFocused && Keyboard.isVisible ? keyboardHeight-30 : 0}
        >
          <Input
            placeholder="Type your message here"
            w={"80%"}
            p={4}
            fontFamily={"Hellix-SemiBold"}
            fontSize="lg"
            //autocomplete="off"

            value={message}
            onChangeText={(text) => setMessage(text)}
            backgroundColor={"#F2F2F2"}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <TouchableOpacity
            onPress={() => {
              handleSend();
            }}
          >
            <Box
              bg={"#5F8D96"}
              borderRadius="full"
              p={4}
              w={16}
              h={16}
              justifyContent="center"
              alignItems="center"
            >
              <Icons name="send" color="white" size={25} type="material" />
            </Box>
          </TouchableOpacity>
        </HStack>
      </Actionsheet.Content>
    </Actionsheet>
  );
}
