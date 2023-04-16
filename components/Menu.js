import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Switch
} from 'react-native';


const Menu = () => {
    const themeColors={
        background:{
            light:'white',
            dark:'#393E46',
        },
        text:{
            light:'black',
            dark:'white',
        }
    }
   
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const [language,Setlanguage] = useState('Language');
  const [backButtonText,setBackButtonText]= useState('Back');
  const [themeText,setThemeText] = useState('Theme')
  const [isDarkTheme,setIsDarkTheme]= useState(false);
  const [backGroundColor,setBackGroundColor] = useState(themeColors.background.light);
  const [textColor,setTextColor] = useState(themeColors.text.light);
  


  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    const newState = !isEnabled;
    setIsEnabled(newState);
    if (newState) {
        Setlanguage('Dil');
        setBackButtonText('Geri');
        setThemeText('Tema');
    } else {
    Setlanguage('Language');
    setBackButtonText('Back');
    setThemeText('Theme');
  }
};

    const changeTheme = ()=>{
        setIsDarkTheme(previousState => !previousState);
        const newState = !isDarkTheme;
        setIsDarkTheme(newState);
        if (newState){
            setBackGroundColor(themeColors.background.dark);
            setTextColor(themeColors.text.dark);
        }else{
            setBackGroundColor(themeColors.background.light);
            setTextColor(themeColors.text.light);
        }
        
};


  return (
    <SafeAreaView style={[styles.container,{backgroundColor: backGroundColor}]}>
      <View style={styles.titleWrapper}>
        <TouchableOpacity onPress={() => navigation.navigate('Main')} style={styles.titles}>

        {
        isDarkTheme ? <Image source={require('../assets/backIconLight.png')} style={styles.backIcon} /> : 
        <Image source={require('../assets/backIconDark.png')} style={styles.backIcon} />
    
        }

          
          <Text style={[styles.titleText,{color:textColor}]}>{backButtonText}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.languageToggleWrapper}>
        <Switch
          trackColor={{ false: 'grey', true: 'grey' }}
          thumbColor={isEnabled ? 'white' : 'white'}
          onValueChange={toggleSwitch}
          value={isEnabled}
          
        />
        <Text style={[styles.languageText,{color:textColor}]}>{language}</Text>
        {
        isEnabled ?
         <Image source={require('../assets/turkishIcon.png')} style={styles.countryFlagIcon} />
         :
        <Image source={require('../assets/englishIcon.png')} style={styles.countryFlagIcon}
        />
        }
        </View>
        <View style={styles.themeToggleWrapper}>
        <Switch
          trackColor={{ false: 'grey', true: 'grey' }}
          thumbColor={isDarkTheme ? 'white' : 'white'}
          onValueChange={changeTheme}
          value={isDarkTheme}
          
        />
        <Text style={[styles.languageText,{color:textColor}]}>{themeText}</Text>
        {
        isDarkTheme ?
         <Image source={require('../assets/themeIconLight.png')} style={styles.countryFlagIcon} />
         :
        <Image source={require('../assets/themeBlack.png')} style={styles.countryFlagIcon}
        />
        }
        </View>


        
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleWrapper: {
    marginHorizontal: 8,
    marginTop: 32,
    
  },
  titleText: {
    fontSize: 36,
  },
  backIcon: {
    width: 30,
    height: 30,
  },
  backIconWhite:{
    width:30,
    height:60,

  },
  titles: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageToggleWrapper:{
    marginTop:16,
    marginHorizontal:48,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  languageText:{
    fontSize:24,
    fontWeight:'300',
    marginLeft:12,
  },
  countryFlagIcon:{
    width:50,
    height:50,
    marginRight:8,
    
  },
  themeToggleWrapper:{
    marginTop:24,
    marginHorizontal:48,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
  }
});

export default Menu;

