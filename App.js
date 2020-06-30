import React, {useState, useEffect} from 'react';
import { SafeAreaView, StyleSheet,  StatusBar, YellowBox  } from 'react-native';
import {decode, encode} from 'base-64'; //para guardar en firebase
import firebase from './src/utils/firebase';
import 'firebase/auth';
import Auth from './src/components/Auth';
import ListCumple from './src/components/ListCumple';

if(!global.btoa) global.btoa = encode;
if(!global.atob) global.atob = decode;

YellowBox.ignoreWarnings(['Setting a timer']);

export default function App() {
  const [user, setUser] = useState(undefined)

  useEffect(()=>{
    firebase.auth().onAuthStateChanged((response)=>{
      setUser(response);
    })
  },[])

  if(user === undefined) return null;

  return (
    <>
      <StatusBar barStyle="light-content"/>
      <SafeAreaView style = {styles.backgound}>
        {user ? <ListCumple/>: <Auth/>}
      </SafeAreaView>
    </>
  )
}
/* 
function Logout(){

  const logout = () =>{
    firebase.auth().signOut()
  }
  return (
    <View>
      <Text>Estas logueado</Text>
      <Button title="Cerrar sesion" onPress={logout}/>
    </View>
  )
} */

const styles = StyleSheet.create({
  backgound : {
    backgroundColor : "#15212b",
    height : '100%',
  }
})
