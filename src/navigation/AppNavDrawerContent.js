import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";

import {
  HomeIcon,
  SettingsIcon,
  SignOutIcon,
  FilterIcon,
  UserIcon,
} from "../components/common/Icons";
import { useOvermind } from "../store/overmind";

import Firebase from "../storage/firebase";
import { TouchableOpacity } from "react-native-gesture-handler";
// The DrawerContentScrollView takes care of housekeeping for scroll view (notches, etc)
// The DrawerItemList displays the screens that you pass as children to your drawer
// The DrawerItem components are your custom components
// props sent to custom drawer include navigation

function AppNavDrawerContent(props) {
  const { state, actions } = useOvermind();
  const { addSavedFilter, applySavedFilter, clearFilterTags } = actions.oSaved;
  const { getDrawerSavedFilters } = state.oSaved;
  const savedFilters = getDrawerSavedFilters;
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ backgroundColor: "#cccccc", height: 50, marginBottom: -50 }}
      ></View>
      <DrawerContentScrollView {...props}>
        {/* <DrawerItemList {...props} /> */}
        <View style={styles.userInfo}>
          <UserIcon size={20} style={{ marginLeft: 20, paddingRight: 20 }} />
          <Text>{state.oAdmin.email}</Text>
          {/* <DrawerItem
            label={state.oAdmin.email}
            icon={({ focused, color, size }) => <UserIcon size={size} />}
          /> */}
        </View>
        <View style={styles.menuItemStyle}>
          <DrawerItem
            label="Home"
            icon={({ focused, color, size }) => <HomeIcon size={size} />}
            onPress={() =>
              props.navigation.navigate("ViewMoviesTab", {
                screen: "ViewMovies",
                params: {
                  screen: "Movies",
                },
              })
            }
          />
        </View>

        <View style={styles.menuItemStyle}>
          <DrawerItem
            label="Settings"
            icon={({ focused, color, size }) => <SettingsIcon size={size} />}
            onPress={() => props.navigation.navigate("Settings")}
          />
        </View>

        <View style={styles.savedFiltersSectionWrapper}>
          <View style={{ marginLeft: 17, flexDirection: "row" }}>
            <FilterIcon size={20} style={{ marginRight: 10 }} />
            <Text style={[styles.sectionTitle, styles.savedFilterTitle]}>
              Saved Filters
            </Text>
          </View>

          <View style={styles.savedFiltersWrapper}>
            {savedFilters.map((filterObj) => (
              <TouchableOpacity
                key={filterObj.id}
                onPress={() => {
                  clearFilterTags();
                  applySavedFilter(filterObj.id);
                  props.navigation.closeDrawer();
                }}
                style={styles.savedFilterItem}
              >
                <Text style={styles.savedFilterLabel}>{filterObj.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/*
          // Drawer example that navigates into details to a specific movie
         <DrawerItem
          label="Redirect Home"
          onPress={() => {
            setTimeout(
              () =>
                props.navigation.navigate("ViewMoviesTab", {
                  screen: "Details",
                  params: { movieId: 520663 },
                }),
              500
            );
            props.navigation.toggleDrawer();
          }}
        /> */}
        <DrawerItem
          label="Close"
          onPress={() => props.navigation.toggleDrawer()}
        />
      </DrawerContentScrollView>
      <View style={styles.signOut}>
        <DrawerItem
          icon={({ focused, color, size }) => <SignOutIcon size={size} />}
          label="Sign Out"
          onPress={() => Firebase.auth().signOut()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  signOut: {
    marginBottom: 15,
    borderTopColor: "black",
    borderTopWidth: 1,
  },
  userInfo: {
    borderBottomColor: "black",
    borderBottomWidth: 2,
    paddingVertical: 15,
    backgroundColor: "#ccc",
    flexDirection: "row",
  },
  menuItemStyle: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  savedFiltersSectionWrapper: {
    marginTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  sectionTitle: {
    fontSize: 16,
  },
  savedFiltersWrapper: {
    marginLeft: 25,
    marginBottom: 10,
  },
  savedFilterTitle: {
    marginBottom: 10,
  },
  savedFilterLabel: {
    color: "black",
    fontSize: 14,
  },
  savedFilterItem: {
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#cccaaa",
    borderColor: "#555",
    borderWidth: 1,
  },
});

export default AppNavDrawerContent;
