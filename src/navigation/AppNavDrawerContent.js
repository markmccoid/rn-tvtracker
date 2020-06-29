import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import {
  HomeIcon,
  SettingsIcon,
  SignOutIcon,
} from '../components/common/Icons';
import { useOvermind } from '../store/overmind';

import Firebase from '../storage/firebase';
// The DrawerContentScrollView takes care of housekeeping for scroll view (notches, etc)
// The DrawerItemList displays the screens that you pass as children to your drawer
// The DrawerItem components are your custom components
// props sent to custom drawer include navigation

function AppNavDrawerContent(props) {
  const { state, actions } = useOvermind();
  const { addSavedFilter, addTagToFilter, clearFilterTags } = actions.oSaved;
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ backgroundColor: '#cccccc', height: 50, marginBottom: -50 }}
      ></View>
      <DrawerContentScrollView {...props}>
        {/* <DrawerItemList {...props} /> */}
        <View style={styles.menuItemStyle}>
          <DrawerItem
            label="Home"
            icon={({ focused, color, size }) => <HomeIcon size={size} />}
            onPress={() =>
              props.navigation.navigate('ViewMoviesTab', {
                screen: 'ViewMovies',
              })
            }
          />
        </View>

        <View style={styles.menuItemStyle}>
          <DrawerItem
            label="Settings"
            icon={({ focused, color, size }) => <SettingsIcon size={size} />}
            onPress={() => props.navigation.navigate('Settings')}
          />
        </View>

        <View style={styles.customFiltersWrapper}>
          <Text style={styles.sectionTitle}>Custom Filters</Text>
          <DrawerItem
            label="Custom filter"
            onPress={() => {
              addSavedFilter({
                tagOperator: 'AND',
                tags: [
                  'f3cea5d6-ccaf-4d46-864c-e6e6d36c7486',
                  'b98b7d14-ac7c-414c-b084-4d585de74665',
                ],
                name: 'Mark-Lori Next',
                description: 'The next movies for mark and lori',
              });
              props.navigation.closeDrawer();
            }}
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: 1,
              width: '100%',
              padding: 0,
            }}
          />
        </View>
        <DrawerItem
          label="Redirect Home"
          onPress={() => {
            setTimeout(
              () =>
                props.navigation.navigate('ViewMoviesTab', {
                  screen: 'Details',
                  params: { movieId: 520663 },
                }),
              500
            );
            props.navigation.toggleDrawer();
          }}
        />
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
    borderTopColor: 'black',
    borderTopWidth: 1,
  },
  menuItemStyle: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  customFiltersWrapper: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 16,
  },
});

export default AppNavDrawerContent;
