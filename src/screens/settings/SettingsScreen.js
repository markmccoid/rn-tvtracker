import React from 'react';
import { SafeAreaView, Text, Button, StyleSheet } from 'react-native';
import { useOvermind } from '../../store/overmind';

const Settings = ({ navigation }) => {
  const { state, actions } = useOvermind();
  const { savedFilters } = state.oSaved;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.settingsText}>Saved Filters</Text>
      {savedFilters.map((savedFilter) => {
        return (
          <Text key={savedFilter.id} style={styles.settingsText}>
            {savedFilter.name}
          </Text>
        );
      })}
      <Button title="Home" onPress={() => navigation.goBack()} />
      <Button
        title="Create"
        onPress={() => navigation.navigate('Create Saved Filter')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 10,
  },
  settingsText: {
    fontSize: 16,
  },
});

export default Settings;
