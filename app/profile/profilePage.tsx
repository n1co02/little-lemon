import { Text, View, ScrollView } from "react-native";
import Profile from "@/screens/Profile";
import ProfileNavHeader from "@/components/profile/ProfileNavHeader";
export default function Homepage() {
  return (
    <ScrollView>
      <ProfileNavHeader />
      <Profile />
    </ScrollView>
  );
}
