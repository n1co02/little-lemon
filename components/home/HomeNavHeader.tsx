import React, { useContext, useEffect, useState } from "react";
import { View, Image, StyleSheet, Text, Pressable } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "../../context/AppContext";
import { useRouter } from "expo-router";
export default function HomeNavHeader() {
  const [isLoading, setIsLoading] = useState(false);
  const [userFirstName, setUserFirstName] = useState("");
  const { image, setImage } = useContext(AppContext);
  const router = useRouter();
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const firstName = await AsyncStorage.getItem("firstName");
        const userImage = await AsyncStorage.getItem("userImage");
        setUserFirstName(firstName || "");
        setImage(userImage);
      } catch (error) {
        console.log("get home nav async val error", error);
      }
      setIsLoading(false);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ width: 44 }} />
      <Image
        source={require("../../assets/images/Logo.png")}
        style={styles.logo}
      />
      {image && (
        <Pressable onPress={() => router.push("profile/profilePage" as any)}>
          <Image source={{ uri: image }} style={styles.avatar} />
        </Pressable>
      )}
      {!image && (
        <Pressable
          style={styles.avatar}
          onPress={() => router.push("/profile/profilePage" as any)}
        >
          {userFirstName && (
            <Text style={{ fontSize: 22, color: "white" }}>
              {userFirstName.slice(0, 2).toUpperCase()}
            </Text>
          )}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 30,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  logo: {
    resizeMode: "contain",
    height: 70,
    width: 200,
  },
  avatar: {
    height: 44,
    width: 44,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: "black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
  },
});
