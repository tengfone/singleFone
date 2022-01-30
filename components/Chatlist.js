import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import tailwind from "tailwind-rn";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";
import ChatRow from "./ChatRow";

const Chatlist = () => {
  const [matches, setMatches] = useState([]);
  const { user } = useAuth();

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches"),
          where("usersMatched", "array-contains", user.uid)
        ),
        (snapshot) =>
          setMatches(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          )
      ),
    [user]
  );

  // Flatlist is optimal way of using MAP function
  return matches.length > 0 ? (
    <FlatList
      style={tailwind("h-full")}
      data={matches}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ChatRow matchDetails={item} />}
    />
  ) : (
    <View style={tailwind("p-5")}>
      <Text style={tailwind("text-center text-lg")}>
        No matches yet! Get Swiping!
      </Text>
    </View>
  );
};

export default Chatlist;
