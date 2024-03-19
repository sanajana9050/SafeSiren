import { Heading, HStack, Text, View } from 'native-base';
import React from 'react'
//warning - orange, icon - warning
//error - red, icon - error
//success - green, icon - success
//info - blue, icon - info
//default - gray, icon - info
import Icon from 'react-native-vector-icons/MaterialIcons';
//AntDesign



export default function ToastAlert({
    status = "default", 
    heading = "",
    message = "",
}) {
  const color = {
    warning: "orange.500",
    error: "red.500",
    success: "green.500",
    info: "blue.500",
    default: "gray.500",
  };
  const headingDefault = {
    warning: "Warning",
    error: "Error",
    success: "Success",
    info: "Info",
    default: "Info",
  };
  const icon = {
    warning: "warning",
    error: "error",
    success: "check-circle",
    info: "info",
    default: "info",
  }; 
  return (
    <View bg={color[status]} p={3} rounded="md">
      <HStack
        space={2}
        alignItems="center"
        
      >
        <Icon name={icon[status]} size={20} color="white" />
        <Text fontSize={18} color="white" fontFamily={"Hellix-Bold"}>
          {heading ? heading : headingDefault[status]}
        </Text>
      </HStack>

      <Text color="white" fontFamily={"Hellix-Medium"} fontSize="md">
        {message}
      </Text>
    </View>
  );
}