import React, { useContext, useEffect, useState } from "react";
import { View, Image, StyleSheet, Text, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "../../context/AppContext";
import { useRouter } from "expo-router";
export default function ProfileNavHeader() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userFirstName, setUserFirstName] = useState<string>("");
  const [navImage, setNavImage] = useState<string | null>(null);
  const { image } = useContext(AppContext);
  const router = useRouter();
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const firstName = await AsyncStorage.getItem("firstName");
        const userImage = await AsyncStorage.getItem("userImage");
        if (firstName) setUserFirstName(firstName);
        if (userImage) setNavImage(userImage);
      } catch (error) {
        console.log("get profile nav async val error", error);
      }
      setIsLoading(false);
    })();
  }, [image]);

  return (
    <View style={styles.container}>
      <Pressable style={styles.backContainer} onPress={() => router.back()}>
        <Image
          source={require("../../assets/images/arrow-left.png")}
          style={styles.backImage}
        />
      </Pressable>
      <Image
        source={require("../../assets/images/Logo.png")}
        style={styles.logo}
      />
      {navImage && <Image source={{ uri: navImage }} style={styles.avatar} />}
      {!navImage && (
        <View style={styles.avatar}>
          {userFirstName && (
            <Text style={{ fontSize: 22, color: "white" }}>
              {userFirstName.slice(0, 2).toUpperCase()}
            </Text>
          )}
        </View>
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
    backgroundColor: "white",
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
  backContainer: {
    height: 44,
    width: 44,
    borderColor: "black",
    borderRadius: 90,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  backImage: {
    height: 32,
    width: 32,
    resizeMode: "contain",
  },
});
