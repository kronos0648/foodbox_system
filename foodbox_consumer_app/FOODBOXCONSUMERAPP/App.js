import React from 'react';

//스크린 폴더
import Welcome from './screens/Welcome' //웰컴화면
import Start from './screens/Start' //시작화면
import SignUp from './screens/SignUp' //회원가입 화면
import Login from './screens/Login' //로그인 화면
import StoreList from './screens/StoreList';
import OrderRequest from './screens/OrderRequest'; //주문요청 화면
import OrderDetails from './screens/OrderDetails'; //주문요청 화면
import OrderHistoryList from './screens/OrderHistoryList';
import FoodboxAllocationScreen from './screens/FoodboxAllocationScreen';
import FoodboxCodeScreen from './screens/FoodboxCodeScreen';
import FoodboxQRScreen from  './screens/FoodboxQRScreen'
import FoodboxUnlockSuccess from './screens/FoodboxUnlockSuccess';

import { NavigationContainer } from '@react-navigation/native'; //네비게이터 이미지 전환
import { createStackNavigator } from '@react-navigation/stack'; //네비게이터 생성

const Stack = createStackNavigator();//네비게이터 스택 생성

export default function App(){
 return (
   <NavigationContainer>
     {/* 첫화면 */}
     <Stack.Navigator 
     initialRouteName = "Welcome"
     screenOptions={{
       headerShown : false
     }}>
       
        <Stack.Screen
          name = "Welcome" component={Welcome} //웰컴화면
          options={{
            gestureEnabled : Platform.OS === 'ios' ? false : true
          }}
        />
        <Stack.Screen
          name = "Start" component={Start} //시작화면
          options={{
            gestureEnabled : Platform.OS === 'ios' ? false : true
          }}
        />
        <Stack.Screen
          name = "SignUp" component = {SignUp} //회원가입
        />
        <Stack.Screen
          name = "Login" component = {Login} //로그인
        />
        <Stack.Screen 
          name = "StoreList" component = {StoreList} //가게 목록
          options={{
            gestureEnabled : Platform.OS === 'ios' ? false : true
          }}
        />
        <Stack.Screen
          name = "OrderDetails" component = {OrderDetails} //주문 상세 내역
        />
        <Stack.Screen
          name = "OrderRequest" component = {OrderRequest} //주문 요청
        />
        <Stack.Screen
          name = "OrderHistoryList" component = {OrderHistoryList} //주문 목록
        />
        <Stack.Screen
          name = "FoodboxAllocationScreen" component = {FoodboxAllocationScreen} //푸드박스 잠금해제 방식 선택
        />
        <Stack.Screen
          name = "FoodboxQRScreen" component = {FoodboxQRScreen} //푸드박스 QR코드로 잠금해제
        />
        <Stack.Screen
          name = "FoodboxCodeScreen" component = {FoodboxCodeScreen} //푸드박스 식별번호로 잠금해제 선택
        />
        <Stack.Screen
          name = "FoodboxUnlockSuccess" component = {FoodboxUnlockSuccess} //푸드박스 잠금해제 성공
          options={{
            gestureEnabled : Platform.OS === 'ios' ? false : true
          }}
        />
     </Stack.Navigator>
   </NavigationContainer>
)};
 



