import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import tailwind from "tailwind-rn";
import useAuth from "../hooks/useAuth";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import generateId from "../lib/generateId";

const Homescreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const swipeRef = useRef(null);
  const [profiles, setProfiles] = useState([]);

  useLayoutEffect(
    () =>
      onSnapshot(doc(db, "users", user.uid), (snapshot) => {
        if (!snapshot.exists()) {
          navigation.navigate("Modal");
        }
      }),
    []
  );

  useEffect(() => {
    let unsub;

    const fetchCards = async () => {
      const passes = await getDocs(
        collection(db, "users", user.uid, "passes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const swipes = await getDocs(
        collection(db, "users", user.uid, "swipes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const passedUserIds = passes.length > 0 ? passes : ["randomString"];
      const swipedUserIds = swipes.length > 0 ? swipes : ["randomString"];

      unsub = onSnapshot(
        query(
          collection(db, "users"),
          where("id", "not-in", [...passedUserIds, ...swipedUserIds])
        ),
        (snapshot) => {
          setProfiles(
            snapshot.docs
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        }
      );
    };

    fetchCards();
    return unsub;
  }, [db]);

  const swipeLeft = (cardIndex) => {
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];

    console.log(`You swipped left ${userSwiped.displayName}`);

    setDoc(doc(db, "users", user.uid, "passes", userSwiped.id), userSwiped);
  };

  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    const loggedInUser = await (
      await getDoc(doc(db, "users", user.uid))
    ).data();

    // Check both swipped
    getDoc(doc(db, "users", userSwiped.id, "swipes", user.uid)).then(
      (documentSnapshot) => {
        if (documentSnapshot.exists()) {
          // Matched!
          setDoc(
            doc(db, "users", user.uid, "swipes", userSwiped.id),
            userSwiped
          );
          // Create a match!
          setDoc(doc(db, "matches", generateId(user.uid, userSwiped.id)), {
            users: {
              [user.uid]: loggedInUser,
              [userSwiped.id]: userSwiped,
            },
            usersMatched: [user.uid, userSwiped.id],
            timestamp: serverTimestamp(),
          });

          navigation.navigate("Match", {
            loggedInUser,
            userSwiped,
          });
        } else {
          // Swipe but no match
          console.log(`You swiped on ${userSwiped.displayName}`);
          setDoc(
            doc(db, "users", user.uid, "swipes", userSwiped.id),
            userSwiped
          );
        }
      }
    );
  };

  return (
    <SafeAreaView style={tailwind("flex-1")}>
      <View style={tailwind("flex-row items-center justify-between px-5")}>
        <TouchableOpacity style={tailwind("")} onPress={logout}>
          <Image
            style={tailwind("h-10 w-10 rounded-full")}
            source={{ uri: user?.photoURL }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Image
            style={tailwind("h-14 w-14")}
            source={{
              uri: "https://c.tenor.com/EAx58J383ocAAAAi/heart-break-heart-broken.gif",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={tailwind("")}
          onPress={() => navigation.navigate("Chat")}
        >
          <Ionicons size={30} name="chatbubbles-sharp" color="#e0395b" />
        </TouchableOpacity>
      </View>

      <View style={tailwind("flex-1 -mt-6")}>
        <Swiper
          ref={swipeRef}
          containerStyle={{ backgroundColor: "transparent" }}
          cards={profiles}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity={true}
          verticalSwipe={false}
          onSwipedLeft={(cardIndex) => {
            swipeLeft(cardIndex);
            console.log("Swipe Pass");
          }}
          onSwipedRight={(cardIndex) => {
            swipeRight(cardIndex);
            console.log("Swipe Yes");
          }}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "LIKE",
              style: {
                label: {
                  textAlign: "left",
                  color: "green",
                },
              },
            },
            top: {
              title: "SUPER LIKE",
              style: {
                label: {
                  textAlign: "center",
                  color: "white",
                },
              },
            },
          }}
          renderCard={(card) =>
            card ? (
              <View
                key={card.id}
                style={tailwind("relative bg-white h-3/4 rounded-xl")}
              >
                <Image
                  style={tailwind("h-full w-full rounded-xl")}
                  source={{ uri: card.photoURL }}
                />
                <View
                  style={[
                    tailwind(
                      "absolute bottom-0 justify-between items-center bg-white w-full flex-row h-20 px-6 py-2 rounded-b-xl"
                    ),
                    style.cardShadow,
                  ]}
                >
                  <View>
                    <Text style={tailwind("text-xl font-bold")}>
                      {card.displayName}
                    </Text>
                    <Text>{card.job}</Text>
                  </View>
                  <Text style={tailwind("text-2xl font-bold")}>{card.age}</Text>
                </View>
              </View>
            ) : (
              <View
                style={[
                  tailwind(
                    "relative bg-white h-3/4 rounded-xl justify-center items-center"
                  ),
                  style.cardShadow,
                ]}
              >
                <Text style={tailwind("font-bold pb-5")}>No More Profiles</Text>

                <Ionicons size={30} name="sad-outline" color="#FF0000" />
              </View>
            )
          }
        />
      </View>

      <View style={tailwind("flex flex-row justify-evenly")}>
        <TouchableOpacity
          onPress={() => {
            swipeRef.current.swipeLeft();
          }}
          style={tailwind(
            "items-center justify-center rounded-full w-16 h-16 bg-red-200"
          )}
        >
          <Entypo name="cross" size={30} color="red" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            swipeRef.current.swipeTop();
          }}
          style={tailwind(
            "items-center justify-center rounded-full w-16 h-16 bg-yellow-200"
          )}
        >
          <Entypo name="star" size={30} color="yellow" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            swipeRef.current.swipeRight();
          }}
          style={tailwind(
            "items-center justify-center rounded-full w-16 h-16 bg-green-200"
          )}
        >
          <Entypo name="heart" size={30} color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Homescreen;

const style = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
