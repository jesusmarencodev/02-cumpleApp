import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import firebase from '../utils/firebase';
import 'firebase/firestore';

firebase.firestore().settings({experimentalForceLongPolling: true});//esta configuracion es obligatoria para guardar en android
const db = firebase.firestore(firebase);

export default function AddCumple(props) {
  const {user, setShowList, setReloadData} = props;
  const [isDatePicketVisible, setIsDatePicketVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [formError, setFormError] = useState({})

  const onChange = (e, type) =>{
    setFormData({
      ...formData,
      [type] : e.nativeEvent.text
    })
  }

  const onSubmit = ( ) => {
    let errors = {};
    if(!formData.name || !formData.lastname || !formData.dateBirth){
      if(!formData.name) errors.name = true;
      if(!formData.lastname) errors.lastname = true;
      if(!formData.dateBirth) errors.dateBirth = true;
    }else{
      const data = formData;
      data.dateBirth.setYear(0);
      db.collection(user.uid)
        .add(data)
        .then(()=>{
          console.log("OK")
          setShowList(true);
          setReloadData(true);
        })
        .catch((error)=>{
          console.log("error")
          setFormError({name:true, lastname:true, dateBirth:true})
        })
    }
    
    setFormError(errors);
  }

  const hideDatePicker = () => {
    setIsDatePicketVisible(false);
  }

  const handlerConfirm = (date) => {
    const dateBirth = date;
    dateBirth.setHours(0);
    dateBirth.setMinutes(0);
    dateBirth.setSeconds(0);
    setFormData({...formData, dateBirth})
    hideDatePicker(); //esto se usa para ios puesto que para android no es necesario
  }

  const showDatePicker = () => {
    setIsDatePicketVisible(true);
  }

  return (
    <>
      <View style={styles.container}>
        <TextInput
          style={[styles.input, formError.name && {borderColor : "#940c0c"}]}
          placeholder="Nombre"
          placeholderTextColor ="#969696"
          onChange={(e) => onChange(e, "name")}
        />
        <TextInput
          style={[styles.input, formError.lastname && {borderColor : "#940c0c"}]}
          placeholder="Apellido"
          placeholderTextColor ="#969696"
          onChange={(e) => onChange(e, "lastname")}
        />
        <View style={[styles.input, styles.datePicker, formError.dateBirth && {borderColor:"#940c0c"}]}>
          <Text style={{ color : formData.dateBirth ? "#fff" : "#969696", fontSize : 18,}} onPress={showDatePicker}>
            {formData.dateBirth 
              ? moment(formData.dateBirth).format("LL")
              : "Fecha de Nacimiento"
            }
          </Text>
        </View>
        <TouchableOpacity onPress={onSubmit}>
          <Text style={styles.addButton}>Crear cumpleaños</Text>
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        isVisible={isDatePicketVisible}
        mode="date"
        onConfirm={handlerConfirm}
        onCancel={hideDatePicker}
      />
    </>
  )
}

const styles = StyleSheet.create({
  container : {
    height : 100,
    width : "100%",
    height : "100%",
    justifyContent : "center",
    alignItems : "center"
  },
  input : {
    height : 50,
    color : "#fff",
    width : "80%",
    marginBottom : 25,
    backgroundColor : "#1e3040",
    paddingHorizontal : 20,
    borderRadius : 50,
    fontSize : 18,
    borderWidth : 1,
    borderColor :"#1e3040",
  },
  datePicker : {
    justifyContent : "center",
  },
  addButton : {
    fontSize :18,
    color : "#fff",
  },
})
