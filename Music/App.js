/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView,StyleSheet,ScrollView,View,Text,StatusBar} from 'react-native';

import {Header,LearnMoreLinks,Colors,DebugInstructions,ReloadInstructions} from 'react-native/Libraries/NewAppScreen';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import login from './login';
import register from './register';
import home from './home';
import player from './player';
import song_list from './song_list';

const Stack = createStackNavigator();

const App: () => React$Node = () => {
  return (
    // <View>
    //   <Text>appp page </Text>
    // </View>

    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={login} />
        <Stack.Screen name="register" component={register} />
        <Stack.Screen name="home" component={home} />
        <Stack.Screen name="player" component={player}/>
        <Stack.Screen name="song_list" component ={song_list}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
