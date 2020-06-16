import React from 'react';
import { useNavigation } from '@react-navigation/native';

const CustomFallback = (props: { error: Error, resetError: Function }) => {
  let navigation = useNavigation();

  return (
    <View>
      <Text>Something happened!</Text>
      <Text>{props.error.toString()}</Text>
      <Button onPress={props.resetError} title={'Try again'} />
    </View>
  );
};
