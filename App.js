import React,{useReducer,useContext} from 'react';
import { StyleSheet,View,Text } from 'react-native';
import Main from './components/Main.js';
import Menu from './components/Menu.js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import mainReducer from './reducer/mainReducer.js'
import AppContext from './context/MainContext.js';


const Stack = createNativeStackNavigator();
const initialState = {
  ingredients: "",
  recipe: "",
  error: "",
  loading: false,
  buttonText: "Get Recipe",
  buttonDisabled: false,
  buttonColor: "#00AEEF",
  inputMargin: "50%",
  showPrompt: true,
  showClearButton: false,
  titleFontSize: 42,
  ingredients_value: {
    english : ["Chicken,Mushroom,Cream,Spaghetti..."],
    turkish : ['Tavuk,Mantar,Krema,Spagetti...']
  } ,
  language: "english",
  promptText : "What food ingredients do you have?",
  clearButtonText : 'Clear'
};


const App = () => {
  const [state, dispatch] = useReducer(mainReducer, initialState);
  let prompt_lang = ''
  
  const isEnglishLang = state.language ==='english';

  if (state.language ==='english'){
    prompt_lang = `Could you recommend a popular and delicious recipe that can be made with the following ingredients? Ingredients: ${state.ingredients}. Please write the recipe step by step and in detail, indicate the measurements in grams, and the temperature in Celsius. Write the name of the dish and finally, mention the total calories. You don't have to use every ingredient listed.`
  }else{
    prompt_lang= `Aşağıdaki malzemelerle yapılabilecek popüler ve lezzetli bir yemek tarifi önerebilir misin? Malzemeler: ${state.ingredients}. Lütfen tarifi adım adım ve detaylı bir şekilde yaz, ölçüleri gram, sıcaklığı Celsius cinsinden belirt ve yemeğin adını yaz. Son olarak, yemeğin kalorisini belirt. Yazılan her malzemeyi kullanmak zorunda değilsin.`
  }

  const toggleLanguage = () => {
    dispatch({ type: "TOGGLE_LANGUAGE" });
  };

  const clearButtonFunc = () => {
    dispatch({ type: "RESTART_SCREEN" });
  };


  const handleGetRecipe = async () => {
    if (state.ingredients.trim() === "") {
      
      dispatch({ type: "SET_ERROR", newError: isEnglishLang ? "please enter ingredients." : 'Lutfen malzemeleri girin.' });
      return;
    }

    try {
      dispatch({ type: "START_LOADING" });
      dispatch({
        type: "START_RECIPE",
        newButtonText: isEnglishLang? "Recipe being prepared..." : 'Tarif hazirlaniyor...',
      });

      if (state.error !== '') {
        dispatch({ type: "CLEAR_ERROR" });
      }
      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer <token>`,
        },
        body: JSON.stringify({
          model: "text-davinci-003",
          temperature: 0.7,
          prompt: prompt_lang,
          max_tokens: 500,
          top_p: 1,
        }),
      });

      dispatch({ type: "STOP_LOADING" });
      dispatch({ type: "DISABLED_BUTTON_FALSE" });

      if (state.ingredients !== "") {
        dispatch({
          type: "READY_FOR_ANOTHER_RECIPE",
          newButtonText: isEnglishLang ? "Find Another Recipe" : "Baska Tarif Bul",
        });
      }
      const data = await response.json();
      const recipeText = data.choices[0].text;
      const formattedRecipe = formatRecipe(recipeText);

      dispatch({ type: "AFTER_RECIPE_FINISHED", newRecipe: formattedRecipe });
    } catch (error) {
      console.error(error);
      dispatch({
        type: "SET_ERROR",
        newError: isEnglishLang? "An error occurred while getting the recipe." : "Tarif hazirlanirken bir hata olustu.",
      });
    }
  };

  const formatRecipe = (recipeText) => {
    const recipeLines = recipeText.split("\n");
    const recipeName = recipeLines[0].trim();
    const ingredients = recipeLines.slice(1, recipeLines.length - 1).join("\n");
    const instructions = recipeLines[recipeLines.length - 1].split(": ")[1];
  
    return (
      <View>
        <Text style={styles.recipeName}>{recipeName}</Text>
        <Text style={styles.ingredients}>{ingredients}</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
  };

  return (
  <AppContext.Provider value={{state,handleGetRecipe,clearButtonFunc,dispatch,toggleLanguage}}>
  <NavigationContainer>
    <Stack.Navigator screenOptions={{
    headerShown: false
    }}>
      <Stack.Screen name="Main" component={Main}/>
      <Stack.Screen name="Menu" component={Menu} />
    </Stack.Navigator>
  </NavigationContainer>
  </AppContext.Provider>
  
  );
};

const styles = StyleSheet.create({
  
  
});

export default App;
