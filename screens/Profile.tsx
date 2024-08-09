import React, { useState, useEffect, useContext } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  Platform,
  View,
  TextInput,
  Pressable,
  Image,
  Alert,
} from "react-native";
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { AppContext } from "../context/AppContext";
import {
  validateEmail,
  validateName,
  validatePhone,
} from "../utils/Validation";
import { useRouter } from "expo-router";
export default function Profile() {
  const [clearLoading, setClearLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);
  const [orderChecked, setOrderChecked] = useState<boolean>(false);
  const [passwordChecked, setPasswordChecked] = useState<boolean>(false);
  const [specialChecked, setSpecialChecked] = useState<boolean>(false);
  const [newslettersChecked, setNewslettersChecked] = useState<boolean>(false);
  const [userFirstName, setUserFirstName] = useState<string>("");
  const [userLastName, setUserLastName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const { setOnboardingComplete, image, setImage } = useContext(AppContext);
  const router = useRouter();
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const email = await AsyncStorage.getItem("email");
        const firstName = await AsyncStorage.getItem("firstName");
        const lastName = await AsyncStorage.getItem("lastName");
        const phone = await AsyncStorage.getItem("number");
        const userImage = await AsyncStorage.getItem("userImage");
        const userChecked = await AsyncStorage.getItem("checkedVals");
        const parsedChecked = userChecked ? JSON.parse(userChecked) : null;

        if (email) setUserEmail(email);
        if (firstName) setUserFirstName(firstName);
        if (lastName) setUserLastName(lastName);
        if (phone) setPhoneNumber(phone);
        if (userImage) setImage(userImage);
        if (parsedChecked) {
          setOrderChecked(parsedChecked.orderChecked);
          setPasswordChecked(parsedChecked.passwordChecked);
          setSpecialChecked(parsedChecked.specialChecked);
          setNewslettersChecked(parsedChecked.newslettersChecked);
        }
      } catch (error) {
        console.log("get profile async val error", error);
      }
      setIsLoading(false);
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const checkboxConfig = [
    {
      labelText: "Order statuses",
      stateVal: orderChecked,
      setVal: setOrderChecked,
    },
    {
      labelText: "Password changes",
      stateVal: passwordChecked,
      setVal: setPasswordChecked,
    },
    {
      labelText: "Special offers",
      stateVal: specialChecked,
      setVal: setSpecialChecked,
    },
    {
      labelText: "Newsletters",
      stateVal: newslettersChecked,
      setVal: setNewslettersChecked,
    },
  ];

  const storeProfileData = async () => {
    const checkedStringified = JSON.stringify({
      orderChecked,
      passwordChecked,
      specialChecked,
      newslettersChecked,
    });
    try {
      setIsSaveLoading(true);
      await AsyncStorage.setItem("firstName", userFirstName);
      await AsyncStorage.setItem("lastName", userLastName);
      await AsyncStorage.setItem("email", userEmail);
      if (image) await AsyncStorage.setItem("userImage", image);
      await AsyncStorage.setItem("number", phoneNumber);
      await AsyncStorage.setItem("checkedVals", checkedStringified);
      Alert.alert("Profile Info Saved!");
    } catch (error) {
      console.log("set profile data", error);
    }
    setIsSaveLoading(false);
  };

  const clearData = async () => {
    try {
      setClearLoading(true);
      await AsyncStorage.clear();
      setOnboardingComplete(false);
      router.push("onboarding/onboardingPage" as any);
    } catch (error) {
      console.log("wipe storage error", error);
    }
    setClearLoading(false);
  };

  const fieldsValid = () =>
    validateEmail(userEmail) &&
    validateName(userFirstName) &&
    validateName(userLastName) &&
    validatePhone(phoneNumber);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          backgroundColor: "white",
          borderColor: "#495E57",
          borderWidth: 2,
          borderRadius: 10,
          margin: 5,
        }}
      >
        {isLoading && <Text>Loading...</Text>}
        {!isLoading && (
          <View style={styles.body}>
            <Text style={[styles.headerTwo, { color: "white" }]}>
              Personal Information
            </Text>
            <View>
              <Text style={styles.label}>Avatar</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 20,
                }}
              >
                {!image && (
                  <View style={[styles.avatar, { backgroundColor: "green" }]}>
                    {userFirstName && (
                      <Text style={{ fontSize: 24, color: "white" }}>
                        {userFirstName.slice(0, 2).toUpperCase()}
                      </Text>
                    )}
                  </View>
                )}
                {image && (
                  <Image source={{ uri: image }} style={styles.avatar} />
                )}
                <Pressable style={styles.changeButton} onPress={pickImage}>
                  <Text style={{ fontSize: 14, color: "white" }}>Change</Text>
                </Pressable>
                <Pressable style={styles.removeButton}>
                  <Text style={{ fontSize: 14, color: "black" }}>Remove</Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.textInput}
                value={userFirstName}
                onChangeText={setUserFirstName}
              />
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.textInput}
                value={userLastName}
                onChangeText={setUserLastName}
              />
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.textInput}
                value={userEmail}
                onChangeText={setUserEmail}
              />
              <Text style={styles.label}>Phone number</Text>
              <TextInput
                style={styles.textInput}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>
          </View>
        )}
        <View style={styles.emailView}>
          <Text style={styles.headerTwo}>Email Notifications</Text>
          {checkboxConfig.map((config) => (
            <View style={styles.checkboxContainer} key={config.labelText}>
              <Checkbox value={config.stateVal} onValueChange={config.setVal} />
              <Text style={styles.checkboxLabel}>{config.labelText}</Text>
            </View>
          ))}
        </View>
        <Pressable
          style={styles.logoutButton}
          onPress={clearData}
          disabled={clearLoading}
        >
          <Text style={styles.largeButtonText}>
            {clearLoading ? "Loading..." : "Logout"}
          </Text>
        </Pressable>
        <View style={styles.bottomButtonContainer}>
          <Pressable
            style={[
              styles.bottomButtons,
              {
                backgroundColor: "#ffffff",
                borderWidth: 2,
                borderRadius: 10,
                borderColor: "#495E57",
              },
            ]}
          >
            <Text style={styles.smallbuttonText}>Discard Changes</Text>
          </Pressable>
          <Pressable
            style={[
              styles.bottomButtons,
              {
                backgroundColor: isSaveLoading ? "rgba(0, 0, 0, 0.5)" : "black",
                opacity: fieldsValid() ? 1 : 0.5,
              },
            ]}
            onPress={storeProfileData}
          >
            <Text style={styles.smallbutton2Text}>
              {isSaveLoading ? "Loading..." : "Save Changes"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  body: {
    backgroundColor: "white",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
    display: "flex",
    flexDirection: "column",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textInput: {
    width: "100%",
    height: 50,
    fontSize: 18,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#495E57",
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: "#495E57",
    marginBottom: 5,
    marginTop: 20,
  },
  headerTwo: {
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "black",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 35,
    marginBottom: 25,
    marginLeft: "auto",
    marginRight: 25,
  },
  avatar: {
    height: 62,
    width: 62,
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  changeButton: {
    backgroundColor: "#0a6035",
    borderRadius: 8,
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  removeButton: {
    backgroundColor: "white",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emailView: {
    backgroundColor: "white",
    width: "90%",
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    rowGap: 20,
  },
  bottomButtonContainer: {
    display: "flex",
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  logoutButton: {
    width: "90%",
    backgroundColor: "#f8c736",
    marginTop: 20,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bottomButtons: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
  },
  largeButtonText: { fontSize: 24, color: "black", textAlign: "center" },
  smallbutton2Text: { fontSize: 15, color: "#ffffff", textAlign: "center" },
  smallbuttonText: { fontSize: 15, color: "#495E57", textAlign: "center" },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  checkboxContainer: { display: "flex", flexDirection: "row" },
});
