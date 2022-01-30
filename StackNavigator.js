import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { View, Text } from "react-native";
import Homescreen from "./screens/Homescreen";
import Chatscreen from "./screens/Chatscreen";
import Loginscreen from "./screens/Loginscreen";
import useAuth from "./hooks/useAuth";
import Modalscreen from "./screens/Modalscreen";
import Matchscreen from "./screens/Matchscreen";
import Messagescreen from "./screens/Messagescreen"

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Group>
            <Stack.Screen name="Home" component={Homescreen} />
            <Stack.Screen name="Chat" component={Chatscreen} />
            <Stack.Screen name="Message" component={Messagescreen} />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen name="Modal" component={Modalscreen} />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: "transparentModal" }}>
            <Stack.Screen name="Match" component={Matchscreen} />
          </Stack.Group>
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Loginscreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
