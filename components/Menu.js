import { StyleSheet, Text, View,TouchableOpacity,Image } from 'react-native'
import React,{useContext} from 'react'
import { useNavigation } from '@react-navigation/native';
import AppContext from '../context/MainContext';



const Menu = () => {
  const navigation = useNavigation();
  const {state,toggleLanguage} = useContext(AppContext)
  
  return (
    <>
    <View style={styles.titleWrapper}>
      <TouchableOpacity style={styles.backIconWrapper} onPress={()=>{navigation.navigate('Main')}}>
        {state.language === 'english' ? 
        <Text style={styles.backTitle}>Back</Text>
        : 
        <Text style={styles.backTitle}>Geri</Text>
        }
      </TouchableOpacity>
    </View>
    <View testID="lang-button-container" style={styles.langButtonContainer}>
                <TouchableOpacity testID="lang-button" onPress={toggleLanguage} style={styles.langTextWrapper}>
                    <Text testID="lang-flag" style={{fontSize:36}} >{state.language === "english" ? "🇹🇷" : "🇬🇧"}</Text>
                    <Text testID="lang-text" style={{fontSize:24}} >{state.language === "english" ? "Dil Degistir" : "Change Language"} </Text>
                </TouchableOpacity>
                
            </View>
    </>
  )
}

export default Menu

const styles = StyleSheet.create({
  titleWrapper:{
    marginTop: 72,
    marginHorizontal: 16,
  },
  backTitle:{
    fontSize:24,
  },
  langButtonContainer:{
    marginHorizontal:16,
    marginTop:24,
  },
  langTextWrapper:{
    flexDirection :'row',
    justifyContent:'center',
    alignItems:'center'
  }
})