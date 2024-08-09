import { useState } from "react";
import {
  filterMenuItems,
  selectAllMenu,
  insertDish,
} from "../../database/Database";
import { MenuItem } from "../../constants/Types";

export const useMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");

  const filterMenu = () => {
    filterMenuItems(activeFilters, searchInput).then(setMenuItems);
  };

  const loadMenu = async () => {
    try {
      const menuItems = await selectAllMenu();
      setMenuItems(menuItems);
      setFilterCategories([
        ...new Set(
          menuItems?.map(
            (i: { category: string }) =>
              i.category?.charAt(0).toUpperCase() + i.category?.slice(1)
          ) as string[]
        ),
      ]);
    } catch (err) {
      console.error(`There was an error selecting all menu items: ${err}`);
    }
  };
  return {
    menuItems,
    setMenuItems,
    filterCategories,
    activeFilters,
    setActiveFilters,
    searchInput,
    setSearchInput,
    filterMenu,
    loadMenu,
  };
};

export const insertDishIntoDatabase = (menuItems: MenuItem[]) => {
  menuItems.forEach((item) => {
    insertDish(
      item.name,
      item.description,
      item.price,
      item.image,
      item.category
    );
  });
};
