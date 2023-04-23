import { StyleSheet, Text, View,Image, TouchableOpacity } from 'react-native'
import React from 'react'
import '../assets/menuIcon.png'
import { useNavigation } from '@react-navigation/native';


const Title = ({titleFontSize}) => {
  return (
    <View style={styles.titleWrapper}>
          <Text style={{fontSize:titleFontSize}}>
            ChefAI
          </Text>
          
    </View>
  )
}

export default Title

const styles = StyleSheet.create({
    titleWrapper:{
        marginTop:16,
        marginHorizontal:16,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    menuIcon:{
        width:30,
        height:30,
        
    }
})