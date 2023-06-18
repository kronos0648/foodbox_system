  import React from 'react';

  import { NavigationContainer } from '@react-navigation/native';
  import { createNativeStackNavigator } from '@react-navigation/native-stack';

  import StartScreen from './app/screens/StartScreen';
  import WelcomeScreen from './app/screens/WelcomeScreen';
  import LoginScreen from './app/screens/LoginScreen';
  import RegisterIDScreen from './app/screens/RegisterIDScreen';
  import RegisterPasswordScreen from './app/screens/RegisterPasswordScreen';
  import RegisterStoreScreen from './app/screens/RegisterStoreScreen';
  import RegisterSuccessScreen from './app/screens/RegisterSuccessScreen';
  import OrederListScreen from './app/screens/OrderListScreen';
  import OrderInfoScreen from './app/screens/OrderInfoScreen';
  import FoodboxAllocationScreen from './app/screens/FoodboxAllocationScreen';
  import FoodboxCodeScreen from './app/screens/FoodboxCodeScreen';
  import FoodboxQRScreen from './app/screens/FoodboxQRScreen';
  import FoodboxManagerScreen from './app/screens/FoodboxManagerScreen';
  
  const Stack = createNativeStackNavigator();

  export default function App() {
    return (
      <NavigationContainer>
        <Stack.Navigator
        initialRouteName = {'Start'}
        screenOptions={{
          headerShown: false,
        }}>
          <Stack.Screen 
          name = 'Start'  
          component={StartScreen}
          options={{
            gestureEnabled : Platform.OS === 'ios' ? false : true
          }}
          />
          
          <Stack.Screen 
          name = 'OrderList'  
          component={OrederListScreen}
          options={{
            gestureEnabled : Platform.OS === 'ios' ? false : true
          }}
          />
          
          <Stack.Screen 
          name = 'Welcome'  
          component={WelcomeScreen}
          options={{
            gestureEnabled : Platform.OS === 'ios' ? false : true
          }}/>

          <Stack.Screen 
          name = 'Login'  
          component={LoginScreen}
          options={{
            gestureEnabled : Platform.OS === 'ios' ? false : true
          }}/>

          <Stack.Screen 
          name = 'RegisterId'  
          component={RegisterIDScreen}/>

          <Stack.Screen 
          name = 'RegisterPassword'  
          component={RegisterPasswordScreen}/>

          <Stack.Screen 
          name = 'RegisterStore'  
          component={RegisterStoreScreen}/>

          <Stack.Screen 
          name = 'RegisterSuccess'  
          component={RegisterSuccessScreen}
          options={{
            gestureEnabled : Platform.OS === 'ios' ? false : true
          }}
          />

          <Stack.Screen 
          name = 'OrderInfo'  
          component={OrderInfoScreen}/>

          <Stack.Screen 
          name = 'FoodboxAllocation'  
          component={FoodboxAllocationScreen}/>

          <Stack.Screen 
          name = 'FoodboxQR'  
          component={FoodboxQRScreen}/>

          <Stack.Screen 
          name = 'FoodboxCode'  
          component={FoodboxCodeScreen}/>

          <Stack.Screen 
          name = 'FoodboxManager'  
          component={FoodboxManagerScreen}
          options={{
            gestureEnabled : Platform.OS === 'ios' ? false : true
          }}
          />

        </Stack.Navigator>
      </NavigationContainer>

    );
  }