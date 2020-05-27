import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { useOvermind } from '../../store/overmind';

import {
  FilterIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
} from '../../components/common/Icons';
import { Badge } from 'react-native-elements';

import ViewMoviesScreen from './ViewMovies/ViewMoviesScreen';
import ViewMoviesFilterScreen from './ViewMovies/ViewMoviesFilterScreen';
import ViewDetails from './ViewDetails/ViewDetails';

const ViewStack = createStackNavigator();
const ViewMoviesStackNav = createStackNavigator();
const ViewMovieDetailsStackNav = createStackNavigator();

const ViewMoviesStack = () => {
  return (
    <ViewMoviesStackNav.Navigator
      mode="modal"
      headerMode="none"
      params="Movies"
    >
      <ViewMoviesStackNav.Screen name="Movies" component={ViewMoviesScreen} />
      <ViewMoviesStackNav.Screen
        name="Filter"
        component={ViewMoviesFilterScreen}
      />
    </ViewMoviesStackNav.Navigator>
  );
};
const ViewStackScreen = () => {
  const { state, actions } = useOvermind();
  let numFilters = state.oSaved.filterData.tags.length;
  let isFiltered = numFilters > 0;

  return (
    <ViewStack.Navigator>
      <ViewStack.Screen
        name="ViewMovies"
        component={ViewMoviesStack}
        options={({ navigation, route }) => {
          // Using optional chaining because initial route object is for stack
          let currentScreenName =
            route?.state?.routeNames[route.state.index] || 'Movies';
          let params = route?.state?.routes[route.state.index].params;
          //TODO - params.showSearch for Movies screen can't be used here to see
          //TODO - if search is show since we flip it off in ViewMovieScreen.js -- find a better way to do this

          return {
            title: 'Movies',
            headerLeft: () => {
              return (
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                  <MenuIcon size={30} style={{ marginLeft: 10 }} />
                </TouchableOpacity>
              );
            },
            headerRight: () => {
              if (currentScreenName === 'Movies') {
                return (
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('Movies', { showSearch: true })
                      }
                    >
                      <SearchIcon
                        color="black"
                        size={30}
                        style={{ marginRight: 15 }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Filter')}
                    >
                      <FilterIcon
                        color={params.showSearch ? 'green' : 'black'}
                        size={30}
                        style={{ marginRight: 15 }}
                      />
                      {isFiltered && (
                        <Badge
                          status="success"
                          value={numFilters}
                          containerStyle={{
                            position: 'absolute',
                            top: -5,
                            right: 10,
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                );
              } else if (currentScreenName === 'Filter') {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Movies', { returning: true })
                    }
                  >
                    <CloseIcon
                      color="black"
                      size={30}
                      style={{ marginRight: 15 }}
                    />
                  </TouchableOpacity>
                );
              }
            },
          };
        }}
      />
      <ViewStack.Screen
        name="Details"
        component={ViewDetails}
        options={({ navigation, route }) => {
          console.log('DETAIL ROUTE', route);
          console.log('Params', route?.params);
          // Using optional chaining because initial route object is for stack
          let currentScreenName =
            route?.state?.routeNames[route.state.index] || 'Details';
          return {
            headerRight: () => {
              return null;
            },
            // headerLeft: () => {
            //   return (
            //     <TouchableOpacity onPress={() => navigation.openDrawer()}>
            //       <MenuIcon size={30} style={{ marginLeft: 10 }} />
            //     </TouchableOpacity>
            //   );
            // },
          };
        }}
      />
    </ViewStack.Navigator>
  );
};

export default ViewStackScreen;
