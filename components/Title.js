import { StyleSheet, Text, View,Image, TouchableOpacity } from 'react-native'
import React from 'react'
import '../assets/menuIcon.png'
import { useNavigation } from '@react-navigation/native';
import AppContext from '../context/MainContext';


const Title = ({titleFontSize}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.titleWrapper}>
          <Text style={{fontSize:titleFontSize}}>
            ChefAI
          </Text>
            <TouchableOpacity onPress={()=>{navigation.navigate('Menu')}}>
              <Image source={require('../assets/menuIcon.png')} style={styles.menuIcon}/>
            </TouchableOpacity>         
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