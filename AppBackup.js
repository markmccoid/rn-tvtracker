import React from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import SearchScreen from "./src/screens/SearchScreen";
import HomeScreen from "./src/screens/HomeScreen";
import DetailScreen from "./src/screens/DetailScreen";
import TagScreen from "./src/screens/TagScreen";
import TagEditScreen from "./src/screens/TagEditScreen";

const HomeStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }) => {
        return {
          title: "View Movies"
        };
      }
    },
    Detail: {
      screen: DetailScreen
    }
  },
  {
    initialRouteName: "Home",
    defaultNavigationOptions: { title: "Movies" }
  }
);

const SearchStack = createStackNavigator({
  Search: {
    screen: SearchScreen,
    navigationOptions: {
      title: "Search For Movies"
    }
  }
});

// Testing nesting a tab navigator in the TagStack
let TagTabNavigator = createBottomTabNavigator(
  {
    TagView: {
      screen: TagScreen,
      navigationOptions: () => {
        console.log("in TagView Tag Screen");
      }
    },
    TagEdit: {
      screen: TagEditScreen
    }
  },
  {
    navigationOptions: () => {
      console.log("in MAINTagView Tag Screen");
    }
  }
);

const TagStack = createStackNavigator({
  TagTab: {
    screen: TagTabNavigator
  },
  Tag: {
    screen: TagScreen,
    navigationOptions: {
      title: "Tags"
    }
  }
});
const TabNavigator = createBottomTabNavigator(
  {
    ViewMovies: {
      screen: HomeStack,
      navigationOptions: ({ navigation }) => {
        // console.log(
        //   "home tab nav",
        //   navigation.state.routes[navigation.state.index]
        // );
        return {
          tabBarLabel: "View Movies",
          tabBarIcon: ({ tintColor }) => (
            <MaterialIcons
              name="movie"
              color={tintColor}
              size={24}
              style={{ marginTop: 5 }}
            />
          )
        };
      }
    },
    Search: {
      screen: SearchStack,
      navigationOptions: {
        tabBarLabel: "Search",
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons
            name="search"
            color={tintColor}
            size={24}
            style={{ marginTop: 5 }}
          />
        )
      }
    },
    Tags: {
      screen: TagStack,
      navigationOptions: {
        tabBarLabel: "Tags",
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome
            name="tags"
            color={tintColor}
            size={24}
            style={{ marginTop: 5 }}
          />
        )
      }
    }
  },
  {
    navigationOptions: ({ navigation }) => {
      console.log("in tab");
      const { routeName } = navigation.state.routes[navigation.state.index];
      console.log("tab routename", routeName);
      return {
        headerTitle: routeName,
        tabBarVisible: false
      };
    }
  }
);
//

export default createAppContainer(TabNavigator);
