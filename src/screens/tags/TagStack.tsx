import React from "react";
import { TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { MenuIcon } from "../../components/common/Icons";
import { colors } from "../../globalStyles";
import TagScreen from "./TagScreen";
//* types
import { TagStackParamList } from "./tagTypes";
const TagStack = createStackNavigator<TagStackParamList>();

const TagStackScreen = () => {
  return (
    <TagStack.Navigator>
      <TagStack.Screen
        name="Tags"
        component={TagScreen}
        options={({ navigation, route }) => {
          return {
            headerTintColor: colors.darkText,
            headerStyle: {
              backgroundColor: colors.navHeaderColor,
            },
            headerLeft: () => {
              return (
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                  <MenuIcon size={30} color={colors.darkText} style={{ marginLeft: 10 }} />
                </TouchableOpacity>
              );
            },
          };
        }}
      />
    </TagStack.Navigator>
  );
};

export default TagStackScreen;
