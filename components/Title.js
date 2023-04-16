import { StyleSheet, Text, View,Image, TouchableOpacity } from 'react-native'
import React from 'react'
import '../assets/menuIcon.png'
import { useNavigation } from '@react-navigation/native';


const Title = ({titleFontSize}) => {
    const navigation = useNavigation();
  return (
    <View style={styles.titleWrapper}>
        <View>
          <Text style={{fontSize:titleFontSize}}>
            ChefAI
          </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
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
        justifyContent:'space-between',
        alignItems:'center'
    },
    menuIcon:{
        width:30,
        height:30,
        
    }
})