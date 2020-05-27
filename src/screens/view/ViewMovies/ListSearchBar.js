import React, { useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useOvermind } from '../../../store/overmind';

const ListSearchBar = ({ show, setShowSearch }) => {
  const { state, actions } = useOvermind();
  const { searchFilter } = state.oSaved;
  const { setSearchFilter } = actions.oSaved;
  React.useEffect(() => {
    console.log('rendering LSB', searchFilter);
  });
  return (
    <View style={styles.container}>
      <TextInput
        style={{
          margin: 10,
          padding: 10,
          borderColor: 'darkgray',
          borderRadius: 5,
          borderWidth: 1,
          width: '80%',
          backgroundColor: '#ddd',
        }}
        placeholder="Search Movie Title"
        onChangeText={(e) => setSearchFilter(e)}
        value={searchFilter}
        autoFocus
        clearButtonMode="while-editing"
      />
      <TouchableOpacity
        onPress={() => {
          setSearchFilter('');
          setShowSearch(false);
        }}
      >
        <Text>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelButton: {},
});
export default ListSearchBar;
