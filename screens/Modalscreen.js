import { useNavigation } from "@react-navigation/native";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import tailwind from "tailwind-rn";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";

const Modalscreen = () => {
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [job, setJob] = useState(null);
  const [age, setAge] = useState(null);
  const navigation = useNavigation();

  const incompleteForm = !image || !job || !age;

  const updateUserProfile = () => {
    setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: image,
      job: job,
      age: age,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <View style={tailwind("flex-1 items-center pt-1")}>
      <Image
        style={tailwind("h-10 w-full p-20")}
        resizeMode="cover"
        source={require("../logos/singleFone-logos_transparent.png")}
      />
      <Text style={tailwind("text-xl text-gray-500 p-2 font-bold")}>
        Welcome {user.displayName}
      </Text>

      <Text style={tailwind("text-center p-4 font-bold text-red-400")}>
        Step 1: Profile Picture
      </Text>
      <TextInput
        value={image}
        onChangeText={(text) => setImage(text)}
        style={tailwind("text-center text-xl pb-2")}
        placeholder="Enter your profile picture URL"
      />

      <Text style={tailwind("text-center p-4 font-bold text-red-400")}>
        Step 2: Job
      </Text>
      <TextInput
        value={job}
        onChangeText={(text) => setJob(text)}
        style={tailwind("text-center text-xl pb-2")}
        placeholder="Enter your job"
      />

      <Text style={tailwind("text-center p-4 font-bold text-red-400")}>
        Step 3: Age
      </Text>
      <TextInput
        keyboardType="number-pad"
        value={age}
        onChangeText={(text) => setAge(text)}
        style={tailwind("text-center text-xl pb-2")}
        placeholder="Enter your age"
      />
      <TouchableOpacity
        onPress={updateUserProfile}
        disabled={incompleteForm}
        style={[
          tailwind("w-64 p-3 rounded-xl absolute bottom-10 bg-red-300"),
          incompleteForm ? tailwind("bg-gray-400") : tailwind("bg-red-300"),
        ]}
      >
        <Text style={tailwind("text-center text-white text-xl")}>
          Update Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Modalscreen;
