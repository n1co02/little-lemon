import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { MenuItem, MenuApiResponse } from "@/constants/Types";
import { ImageKeys } from "@/constants/Types";
import { menuDataUrl } from "@/ApiDefinition";
import {
  insertDishIntoDatabase,
  useMenu,
} from "../components/home/HomeComponent";
import HomeNavHeader from "../components/home/HomeNavHeader";

const Home = () => {
  const {
    menuItems,
    setMenuItems,
    filterCategories,
    activeFilters,
    setActiveFilters,
    searchInput,
    setSearchInput,
    filterMenu,
    loadMenu,
  } = useMenu();

  useEffect(() => {
    loadMenu();
    if (menuItems.length === 0) fetchMenuData();
  }, []);

  useEffect(() => {
    filterMenu();
  }, [activeFilters, searchInput]);

  const categories = ["starters", "mains", "desserts", "drinks", "specials"];
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const fetchMenuData = async () => {
    try {
      const response = await fetch(menuDataUrl);
      const data: MenuApiResponse = await response.json();
      const parsedMenu: MenuItem[] = data.menu;
      setMenuItems(parsedMenu);
      await insertDishIntoDatabase(parsedMenu);
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategories((prevSelectedCategories) => {
      if (prevSelectedCategories.includes(category)) {
        return prevSelectedCategories.filter((item) => item !== category);
      } else {
        return [...prevSelectedCategories, category];
      }
    });
  };

  const images: { [key in ImageKeys]: any } = {
    "greekSalad.jpg": require("../assets/images/greekSalad.jpg"),
    "grilledFish.jpg": require("../assets/images/grilledFish.jpg"),
    "lemonDessert.jpg": require("../assets/images/lemonDessert.jpg"),
    "pasta.jpg": require("../assets/images/pasta.jpg"),
    "bruschetta.jpg": require("../assets/images/bruschetta.jpg"),
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.itemContainer}>
      <Image
        source={images[item.image as ImageKeys]}
        style={styles.image}
        accessibilityLabel={item.name}
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>${item.price}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
  const filteredMenuItems = selectedCategories.length
    ? menuItems.filter((item: { category: string }) =>
        selectedCategories.includes(item.category)
      )
    : menuItems;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View>
          <HomeNavHeader />
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
        <View style={styles.menuContainer}>
          <Text style={styles.orderHeader}>Order for delivery!</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollView}
          >
            {categories.map((category) => (
              <Pressable
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategories.includes(category) &&
                    styles.selectedCategoryButton,
                ]}
                onPress={() => handleCategoryPress(category)}
              >
                <Text style={styles.categoryText}>{category}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <FlatList data={filteredMenuItems} renderItem={renderMenuItem} />
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
  searchBar: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "90%",
    height: 50,
    marginTop: 20,
    marginHorizontal: "auto",
    paddingHorizontal: 5,
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
  menuContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  orderHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  categoryScrollView: {
    flexDirection: "row",
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    backgroundColor: "#e0e0e0",
    marginRight: 10,
  },
  selectedCategoryButton: {
    backgroundColor: "#495E57",
  },
  categoryText: {
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    borderRadius: 10,
  },
  textContainer: {
    maxWidth: "60%",
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  price: {
    fontSize: 16,
    color: "#888",
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Home;
