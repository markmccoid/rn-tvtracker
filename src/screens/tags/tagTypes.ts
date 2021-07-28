import { StackScreenProps, StackNavigationProp } from "@react-navigation/stack";

//* Screens in the Main stacks
//- Main View stack
export type TagStackParamList = {
  Tags: undefined;
};

//* Create Props to be used by each of the screens
//- Main View screen
export type TagsScreenProps = StackScreenProps<TagStackParamList, "Tags">;
