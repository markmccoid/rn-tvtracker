import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useOvermind } from '../../store/overmind';
import SavedFiltersView from '../../components/settings/SavedFiltersView';

const Settings = ({ navigation }) => {
  const { state, actions } = useOvermind();
  const { savedFilters } = state.oSaved;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.settingsContainer}>
          <Text style={styles.settingsText}>Saved Filters</Text>
          <SavedFiltersView />
        </View>
        <View style={styles.settingsContainer}>
          <Text style={styles.settingsText}>Set Default Filter</Text>
          <Text>
            This will be a dropdown box with all the filters. User can choose
            one which will be applied everytime the application is started
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 10,
  },
  settingsContainer: {
    margin: 5,
  },
  settingsText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Settings;
