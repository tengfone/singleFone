import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import Chatlist from "../components/Chatlist";
import Header from "../components/Header";
const Chatscreen = () => {
  return (
    <SafeAreaView>
      <Header title="Chat" />
      <Chatlist />
    </SafeAreaView>
  );
};

export default Chatscreen;
