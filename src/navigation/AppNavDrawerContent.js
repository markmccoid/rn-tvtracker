import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import {
  HomeIcon,
  SettingsIcon,
  SignOutIcon,
  FilterIcon,
  UserIcon,
  SyncIcon,
  CarouselIcon,
} from "../components/common/Icons";
import { useOState, useOActions } from "../store/overmind";

import { TouchableOpacity } from "react-native-gesture-handler";

import { colors } from "../globalStyles";
// The DrawerContentScrollView takes care of housekeeping for scroll view (notches, etc)
// The DrawerItemList displays the screens that you pass as children to your drawer
// The DrawerItem components are your custom components
// props sent to custom drawer include navigation

function AppNavDrawerContent(props) {
  const state = useOState();
  const actions = useOActions();
  const { applySavedFilter, clearFilterTags, hydrateStore } = actions.oSaved;
  const { logUserOut } = actions.oAdmin;
  // only return savedFilters that are marked to show up in
  const savedFilters = state.oSaved.getDrawerSavedFilters;
  const { username, uid, appState } = state.oAdmin;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ backgroundColor: colors.darkbg, height: 50, marginBottom: -55 }}></View>
      <DrawerContentScrollView {...props}>
        {/* <DrawerItemList {...props} /> */}
        <View style={styles.userInfo}>
          <UserIcon
            size={20}
            color={colors.darkfg}
            style={{ marginLeft: 20, paddingRight: 20, paddingTop: 10 }}
          />
          <View style={{ flexDirection: "column", justifyContent: "center", paddingTop: 10 }}>
            <Text style={styles.userText}>{username}</Text>
            {/* <Text style={styles.userText}>Loaded From {appState.dataSource}</Text> */}
          </View>
        </View>
        <View style={styles.menuItemStyle}>
          <DrawerItem
            label="Home"
            icon={({ focused, color, size }) => <HomeIcon size={size} />}
            onPress={() =>
              props.navigation.navigate("ViewTVShowsTab", {
                screen: "ViewTVShows",
                params: {
                  screen: "TVShowsScreen",
                },
              })
            }
          />
        </View>

        <View style={styles.menuItemStyle}>
          <DrawerItem
            label="Carousel View"
            icon={({ focused, color, size }) => <CarouselIcon size={size} />}
            onPress={() => props.navigation.navigate("Carousel View")}
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
            <Text style={[styles.sectionTitle, styles.savedFilterTitle]}>Saved Filters</Text>
          </View>

          <View style={styles.savedFiltersWrapper}>
            {savedFilters.map((filterObj) => (
              <TouchableOpacity
                key={filterObj.id}
                onPress={() => {
                  clearFilterTags();
                  applySavedFilter(filterObj.id);
                  props.navigation.navigate("TVShowsScreen", {
                    filterModified: true,
                  });
                  props.navigation.closeDrawer();
                }}
                style={styles.savedFilterItem}
              >
                <Text style={styles.savedFilterLabel}>{filterObj.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* <View style={styles.menuItemStyle}>
          <DrawerItem
            label={({ focused, color }) => (
              <Text
                style={{ color: appState.dataSource === "local" ? "black" : "green" }}
              >{`Sync from Cloud`}</Text>
            )}
            icon={({ focused, color, size }) => <SyncIcon size={size - 5} />}
            onPress={() => {
              hydrateStore({ uid, forceRefresh: true });
              props.navigation.closeDrawer();
            }}
          />
        </View> */}

        {/*
          // Drawer example that navigates into details to a specific movie
         <DrawerItem
          label="Redirect Home"
          onPress={() => {
            setTimeout(
              () =>
                props.navigation.navigate("ViewTVShowsTab", {
                  screen: "Details",
                  params: { movieId: 520663 },
                }),
              500
            );
            props.navigation.toggleDrawer();
          }}
        /> */}
        <DrawerItem label="Close" onPress={() => props.navigation.toggleDrawer()} />
      </DrawerContentScrollView>
      <View style={styles.signOut}>
        <DrawerItem
          icon={({ focused, color, size }) => (
            <SignOutIcon size={size} color={colors.darkfg} />
          )}
          label={({ focused, color }) => <Text style={styles.signOutLabel}>Sign Out</Text>}
          onPress={() => logUserOut()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  signOut: {
    paddingBottom: 15,
    borderTopColor: "black",
    borderTopWidth: 1,
    backgroundColor: colors.darkbg,
  },
  signOutLabel: {
    color: colors.darkfg,
  },
  userInfo: {
    borderBottomColor: "black",
    borderBottomWidth: 2,
    paddingVertical: 15,
    backgroundColor: colors.darkbg,
    flexDirection: "row",
    alignItems: "center",
  },
  userText: {
    color: colors.darkfg,
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
    color: colors.darkfg,
    fontSize: 15,
  },
  savedFilterItem: {
    padding: 10,
    marginVertical: 4,
    marginLeft: 10,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    backgroundColor: colors.darkbg,
    borderColor: "#777",
    borderRightColor: colors.darkbg,
    borderWidth: 1,
  },
});

export default AppNavDrawerContent;
