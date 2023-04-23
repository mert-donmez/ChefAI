import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useReducer } from "react";
import Loading from "./Loading";
import Title from "./Title";


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
  ingredients_value: ["Chicken,Mushroom,Cream,Spaghetti..."],
  language: "english",
  promptText : "What food ingredients do you have?",
  clearButtonText : 'Clear'
};

function mainReducer(state, action) {
  switch (action.type) {
    case "RESTART_SCREEN":
      return {
        ...state,
        ingredients: "",
        recipe: "",
        buttonText: "Get Recipe",
        buttonColor: "#00AEEF",
        inputMargin: "50%",
        showPrompt: true,
        showClearButton: false,
        titleFontSize: 42,
      };
    case "SET_ERROR":
      return { ...state, error: action.newError };
    case "CLEAR_ERROR":
      return { ...state, error: "" };
    case "START_LOADING":
      return { ...state, loading: true };
    case "STOP_LOADING": {
      return { ...state, loading: false };
    }
    case "SET_INGREDIENTS":
      return {
        ...state,
        ingredients: action.newIngredients,
      };
    case "START_RECIPE":
      return {
        ...state,
        buttonDisabled: true,
        buttonColor: "grey",
        buttonText: action.newButtonText,
        recipe: "",
        inputMargin: 0,
        showPrompt: false,
        titleFontSize: 36,
      };
    case "DISABLED_BUTTON_FALSE":
      return {
        ...state,
        buttonDisabled: false,
      };
    case "READY_FOR_ANOTHER_RECIPE":
      return {
        ...state,
        buttonText: action.newButtonText,
        buttonColor: "green",
      };

    case "AFTER_RECIPE_FINISHED":
      return {
        ...state,
        recipe: action.newRecipe,
        error: "",
        showClearButton: true,
      };
    case "TOGGLE_LANGUAGE":
      const isEnglish = state.language === "english";
      return {
        ...state,
        language: isEnglish ? "turkish" : "english",
        buttonText: isEnglish ? "Tarif Al" : "Get Recipe",
        promptText: isEnglish
          ? "Hangi yiyecek malzemelerine sahipsin?"
          : "What food ingredients do you have?",
        clearButtonText: isEnglish ? "Temizle" : "Clear"
      };
    default:
      throw new Error();
  }
}

const Main = ({navigation}) => {
  
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
          max_tokens: 1000,
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
    <View testID="main-view" style={styles.container}>
        <View testID="title-wrapper" style={styles.titleWrapper}>
            <Title titleFontSize={state.titleFontSize} navigation={navigation}/>
            <View testID="lang-button-container" style={styles.langButtonContainer}>
                <TouchableOpacity testID="lang-button" onPress={toggleLanguage}>
                    <Text testID="lang-text" style={{fontSize:36}} >{state.language === "english" ? "🇹🇷" : "🇬🇧"}</Text>
                </TouchableOpacity>
            </View>
        </View>
        <ScrollView testID="scroll-view">
            <View testID="input-container" style={[styles.inputContainer, { marginTop: state.inputMargin }]}>
                {state.showPrompt && (
                    <Text testID="prompt-text" style={styles.promptTextStyle}>{state.promptText}</Text>
                )}
                <TextInput
                    testID="ingredient-input"
                    style={styles.input}
                    placeholder={
                        state.ingredients_value[
                            (Math.random() * state.ingredients_value.length) | 0
                        ]
                    }
                    value={state.ingredients}
                    onChangeText={(text) => {
                      dispatch({ type: "SET_INGREDIENTS", newIngredients: text });
                      dispatch({ type: "CLEAR_ERROR" });
                    }}
                    
                />
                <TouchableOpacity
                    testID="submit-button"
                    style={[styles.button, { backgroundColor: state.buttonColor }]}
                    onPress={handleGetRecipe}
                    disabled={state.buttonDisabled}
                >
                    <Text style={styles.buttonText}>{state.buttonText}</Text>
                </TouchableOpacity>
                {state.showClearButton && (
                    <TouchableOpacity
                        testID="clear-button"
                        style={[styles.clearButton, { backgroundColor: "red" }]}
                        onPress={clearButtonFunc}
                    >
                        <Text style={styles.buttonText}>{state.clearButtonText}</Text>
                    </TouchableOpacity>
                )}
            </View>
            {state.error !== "" && (
                <View testID="error-container" style={styles.errorContainer}>
                    <Text testID="error-text" style={styles.errorText}>{state.error}</Text>
                </View>
            )}
            {state.loading && <Loading testID="loading-component"/>}
            {state.recipe !== "" && (
                <View testID="recipe-container" style={styles.resultContainer}>
                    <Text testID="recipe-results" style={styles.resultText}>{state.recipe}</Text>
                </View>
            )}
        </ScrollView>
    </View>
);

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: "20%",
  },
  langButtonContainer: {
    alignItems: "flex-end",
    marginHorizontal:16,
    flexDirection:'row'

  },
  inputContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 24,
    marginHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    fontSize: 16,
    marginTop: 16,
    backgroundColor: "#e3e1e6",
    borderRadius: 10,
    borderWidth: 10,
    borderColor: "#e3e1e6",
    paddingHorizontal: 5,
  },
  button: {
    borderRadius: 8,
    marginTop: 16,
    paddingVertical: 8,
  },
  clearButton: {
    borderRadius: 8,
    marginTop: 16,
    paddingVertical: 8,
    width: 100,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  resultContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 16,
    marginHorizontal: "5%",
  },
  resultText: {
    color: "#333333",
    fontSize: 20,
    fontWeight: "bold",
  },
  errorContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    marginTop: 16,
    marginHorizontal: 16,
    paddingVertical: 8,
    borderColor: "red",
    borderWidth: 2,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  promptTextStyle: {
    fontSize: 16,
    fontWeight: "400",
  },
  titleWrapper:{
    flexDirection:'row',
    justifyContent:'space-between',
  }
});

export default Main;
