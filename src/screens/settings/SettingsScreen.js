import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export const Settings = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings Page</Text>
      <Button title="Home" onPress={() => navigation.goBack()} />
    </View>
  );
};
