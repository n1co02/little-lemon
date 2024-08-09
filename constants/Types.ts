export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
};
export interface MenuApiResponse {
  menu: MenuItem[];
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

export type ImageKeys =
  | "greekSalad.jpg"
  | "grilledFish.jpg"
  | "lemonDessert.jpg"
  | "pasta.jpg"
  | "bruschetta.jpg";

export const images: { [key in ImageKeys]: any } = {
  "greekSalad.jpg": require("../../assets/images/greekSalad.jpg"),
  "grilledFish.jpg": require("../../assets/images/grilledFish.jpg"),
  "lemonDessert.jpg": require("../../assets/images/lemonDessert.jpg"),
  "pasta.jpg": require("../../assets/images/pasta.jpg"),
  "bruschetta.jpg": require("../../assets/images/bruschetta.jpg"),
};
