import React, {useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import ActionBar from './ActionBar'
import AddCumple from './AddCumple'

export default function ListCumple() {
  const [showList, setShowList] = useState(false)
  return (
    <View style={styles.container}>
      {showList ? (
        <>
          <Text>Lista</Text>
          <Text>Lista</Text>
          <Text>Lista</Text>
          <Text>Lista</Text>
        </>
      ):
        <AddCumple/>  
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
})
