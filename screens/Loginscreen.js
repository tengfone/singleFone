import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  Image,
  Button,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import useAuth from "../hooks/useAuth";
import tailwind from "tailwind-rn";
import { signInWithGoogle } from "../hooks/useAuth";

const Loginscreen = () => {
  const { signInWithGoogle, loading } = useAuth();
  const navigation = useNavigation();
  const { user } = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <View style={tailwind("flex-1")}>
      <ImageBackground
        resizeMode="cover"
        style={tailwind("flex-1")}
        source={{
          uri: "https://i.pinimg.com/564x/8e/8d/68/8e8d68f84806201866e8ad1c8c6bb3d7.jpg",
        }}
      >
        <Image
          style={[
            tailwind("h-32 w-32 rounded-full"),
            { marginHorizontal: "35%", marginTop: "80%" },
          ]}
          source={{
            uri: "https://c.tenor.com/EAx58J383ocAAAAi/heart-break-heart-broken.gif",
          }}
        />
        <TouchableOpacity
          onPress={signInWithGoogle}
          style={[
            tailwind("absolute bottom-40 w-52 bg-white p-4 rounded-2xl"),
            { marginHorizontal: "25%" },
          ]}
        >
          <Text style={tailwind("font-semibold text-center text-xs")}>
            Sign in to be disappointed!
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default Loginscreen;
