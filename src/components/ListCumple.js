import React, {useState, useEffect} from 'react'
import { StyleSheet, View, ScrollView, Alert } from 'react-native'
import moment from 'moment';
import ActionBar from './ActionBar'
import AddCumple from './AddCumple'
import Birthday from './Birthday';
import firebase from '../utils/firebase';
import 'firebase/firestore';


firebase.firestore().settings({experimentalForceLongPolling: true});//esta configuracion es obligatoria para guardar en android
const db = firebase.firestore(firebase);

export default function ListCumple(props) {
  const {user} = props;
  const [showList, setShowList] = useState(false)
  const [cumple, setCumple] = useState([]);
  const [pasadCumple, setPasadCumple] = useState([]);
  const [reloadData, setReloadData] = useState(false);

 

  useEffect(()=>{
    setCumple([]);
    setPasadCumple([]);
    db.collection(user.uid)
      .orderBy("dateBirth", "asc")
      .get()
      .then((response)=>{
        const itemsArray = [];
        response.forEach((doc)=>{
          const data = doc.data();
          data.id = doc.id;
          itemsArray.push(data);
        })
        formatCumple(itemsArray);
      })
      console.log("ejecutando")
      setReloadData(false);
  },[reloadData])



  const formatCumple = (items) => {
    if(items.length > 0){
      setShowList(true)
    }


    const currentDate = moment().set({
      hour:0,
      minute:0,
      second:0,
      millisecond:0
    });
    const birthdayTempArray = [];
    const pasatBirhdayTempArray = []; 

    items.forEach((item)=>{
      const dateBirth = new Date(item.dateBirth.seconds * 1000)
      
      const dateBirthday = moment(dateBirth)
      
      const currentYear = moment().get("year")
      
      dateBirthday.set({year : currentYear})
      //console.log(dateBirthday, "juju")


      const diffDate = currentDate.diff(dateBirthday, "days");
      const itemTemp = item;
      itemTemp.dateBirth = dateBirth;
      itemTemp.days = diffDate;

      if(diffDate <= 0){
        birthdayTempArray.push(itemTemp);
      }else{
        pasatBirhdayTempArray.push(itemTemp);
      }
    });

    setCumple(birthdayTempArray)
    setPasadCumple(pasatBirhdayTempArray)
  }

  const deleteBirthday = (birthday) => {
    Alert.alert(
      'Eliminar Cumple',
      `¿Estas Seguro? eliminaras el cumpleaños de ${birthday.name} ${birthday.lastname}`,
      [
        {
          text : "Cancelar",
          style: "cancel"
        },
        {
          text : "Eliminar",
          onPress : () => {
            db.collection(user.uid)
              .doc(birthday.id)
              .delete().then(()=>{
                setReloadData(true)
              })
              .catch((err)=>{
                console.log("catch del error")
              })
          },
        },
      ],
      {cancelable : false}
    )
  }

  return (
    <View style={styles.container}>
      {showList ? (
        <ScrollView style={styles.scrollView}>
          {cumple.map((item, index)=>(
            <Birthday key={index} birthday={item} deleteBirthday={deleteBirthday} />
          ))}
          {pasadCumple.map((item, index)=>(
            <Birthday key={index} birthday={item} deleteBirthday={deleteBirthday} />
          ))}
        </ScrollView>
      ):
        <AddCumple user={user} setShowList={setShowList} setReloadData={setReloadData} />  
      }
      <ActionBar
       showList={showList}
       setShowList={setShowList} />
    </View>
  )
}

const styles = StyleSheet.create({
  container : {
    alignItems : "center",
    height : "100%"
  },
  scrollView : {
    marginBottom : 50,
    width : "100%",
  },

})
