import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../common/Buttons';
import { EditIcon, DeleteIcon } from '../common/Icons';
import { useOvermind } from '../../store/overmind';

const SavedFiltersItem = ({ savedFilter }) => {
  const navigation = useNavigation();
  const { actions } = useOvermind();
  const { deleteSavedFilter } = actions.oSaved;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.nameContainer}
        onPress={() => console.log('filter id', savedFilter.id)}
      >
        <Text key={savedFilter.id} style={styles.filterTitle}>
          {savedFilter.name}
        </Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: 50,
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('CreateSavedFilter', {
              params: { filterId: savedFilter.id },
            })
          }
        >
          <EditIcon size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ paddingTop: 4 }}
          onPress={() => deleteSavedFilter(savedFilter.id)}
        >
          <DeleteIcon size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameContainer: {
    padding: 5,
  },
  filterTitle: {
    fontSize: 16,
  },
});

export default SavedFiltersItem;
