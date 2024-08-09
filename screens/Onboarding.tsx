import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "@/context/AppContext";
import { validateEmail, validateName } from "../utils/Validation";
import { useRouter } from "expo-router";
const Onboarding = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const context = useContext(AppContext);
  const { setOnboardingComplete } = context;
  const storeOnboardingData = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem("firstName", name);
      await AsyncStorage.setItem("email", email);
      setOnboardingComplete(true);
      await startNavigation();
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const startNavigation = async () => {
    router.push("home/homePage" as any);
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ alignItems: "center" }}>
          <View style={styles.navBar}>
            <Image
              source={require("../assets/images/Logo.png")}
              style={styles.logo}
            />
          </View>

          <View style={styles.body}>
            <View style={styles.textContainer}>
              <Text style={styles.headerOne}>Little Lemon</Text>
              <Text style={styles.headerTwo}>Chicago</Text>
              <Text style={styles.textBlock}>
                We are a family-owned Mediterranean restaurant, focused on
                traditional recipes served with a modern twist.
              </Text>
            </View>
            <Image
              source={require("../assets/images/cook.png")}
              style={styles.bodyImage}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              placeholder="Put in your name"
              style={styles.textInput}
              value={name}
              onChangeText={setName}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Put in your email"
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
            />
          </View>
          {isLoading && (
            <Pressable style={styles.button}>
              <Text style={{ fontSize: 24, color: "white" }}>Loading...</Text>
            </Pressable>
          )}
          {!isLoading && (
            <Pressable
              style={[
                styles.button,
                {
                  opacity: validateEmail(email) && validateName(name) ? 1 : 0.5,
                },
              ]}
              onPress={storeOnboardingData}
              disabled={!validateEmail(email) || !validateName(name)}
            >
              <Text style={{ fontSize: 24, color: "white" }}>Next</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  navBar: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 30,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  logo: {
    resizeMode: "contain",
    height: 70,
    width: 200,
    marginLeft: "auto",
    marginRight: "auto",
  },
  body: {
    backgroundColor: "#495E57",
    paddingHorizontal: 20,
    paddingVertical: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    maxWidth: "60%",
  },
  inputContainer: {
    width: "90%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 30,
  },
  textInput: {
    width: "100%",
    height: 50,
    borderWidth: 2,
    borderColor: "black",
    fontSize: 18,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderStyle: "solid",
    borderRadius: 10,
  },
  label: {
    fontSize: 20,
    alignSelf: "flex-start",
    color: "#495E57",
  },
  headerOne: {
    fontSize: 28,
    fontWeight: "bold",
    color: "yellow",
  },
  headerTwo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  textBlock: {
    fontSize: 15,

    color: "white",
  },
  bodyImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  button: {
    backgroundColor: "#495E57",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 35,
    marginBottom: 25,
    alignSelf: "center",
  },
});

export default Onboarding;
