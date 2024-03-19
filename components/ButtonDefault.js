import { Text, View, VStack, Image, Spacer, HStack, Box } from "native-base";
import React from "react";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icons from "../components/Icons";

export default function ButtonDefault({
    onPress,
    title,
    color,
    textColor = "white",
}) {
  return (
    <TouchableOpacity
        onPress={onPress}
    >
      <HStack
        space={1}
        w="100%"
        //justifyContent="flex-end"
      >
        {/* a pill shaped with text Get Started */}
        <Box
          borderRadius="full"
          bg={color}
          p={4}
          px={20}
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize="lg" fontFamily={"Hellix-SemiBold"} color={"white"}>
            {title}
          </Text>
        </Box>
        {/* Circle with right arrow */}
        <Box
          bg={color}
          borderRadius="full"
          p={4}
          w={16}
          h={16}
          justifyContent="center"
          alignItems="center"
        >
          <Icons name="arrow-forward" color="white" size={25} type="material" />
        </Box>
      </HStack>
    </TouchableOpacity>
  );
}
