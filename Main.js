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
      return {...state,error: action.newError};
    case 'CLEAR_ERROR':
      return {...state,error:''};
    case 'START_LOADING':
      return{...state,loading:true};
    case 'STOP_LOADING':{
      return {...state,loading:false};
    }
    case 'SET_INGREDIENTS':
      return {
        ...state,
        ingredients:action.newIngredients
      }
    case 'START_RECIPE':
      return{
        ...state,
        buttonDisabled:true,
        buttonColor:'grey',
        buttonText:action.newButtonText,
        recipe:'',
        inputMargin:0,
        showPrompt:false,
        titleFontSize:36
      }
    case 'DISABLED_BUTTON_FALSE':
      return {
        ...state,
        buttonDisabled:false
      }
    case 'READY_FOR_ANOTHER_RECIPE':
      return {
        ...state,
        buttonText:action.newButtonText,
        buttonColor:'green'
      }
      
    case 'AFTER_RECIPE_FINISHED':
      return{
        ...state,
        recipe:action.newRecipe,
        error:'',
        showClearButton:true
      }
    default:
      throw new Error();
  }
}

const Main = () => {
  const [state, dispatch] = useReducer(mainReducer, initialState);

  const clearButtonFunc = () => {
    dispatch({type: 'RESTART_SCREEN'});
  };

  const handleGetRecipe = async () => {
    if (state.ingredients.trim() === "") {
      dispatch({type:'SET_ERROR',newError:"please enter ingredients."})
      return;
    }

    try {
      dispatch({type:"START_LOADING"});
      dispatch({type:'START_RECIPE',newButtonText:"Recipe being prepared..."})
      

      if (state.error) {
        dispatch({type:'CLEAR_ERROR'});
      }
      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer <token>`,
        },
        body: JSON.stringify({
          model: "text-davinci-003",
          temperature: 0,
          prompt: `Here are the food ingredients I have: ${state.ingredients}. Give a recipe that can be made with these ingredients.`,
          max_tokens: 1000,
          top_p: 1,
        }),
      });
      dispatch({type:"STOP_LOADING"});
      dispatch({type:'DISABLED_BUTTON_FALSE'})
      
      if (state.ingredients !== "") {
        dispatch({type:'READY_FOR_ANOTHER_RECIPE',newButtonText:'Find Another Recipe'});
      }
      const data = await response.json();
      const recipeText = data.choices[0].text;
      const formattedRecipe = formatRecipe(recipeText);

      dispatch({type:'AFTER_RECIPE_FINISHED',newRecipe:formattedRecipe})
    } catch (error) {
      console.error(error);
      dispatch({type:'SET_ERROR',newError:'An error occurred while getting the recipe.'})
    }
  };

  const formatRecipe = (recipeText) => {
    const recipeLines = recipeText.split("\n");
    const recipeName = recipeLines[0].trim();
    const ingredients = recipeLines.slice(1, recipeLines.length - 1).join("\n");
    const instructions = recipeLines[recipeLines.length - 1];

    return (
      <View>
        <Text style={styles.recipeName}>{recipeName}</Text>
        <Text style={styles.ingredients}>{ingredients}</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Title titleFontSize={state.titleFontSize} />
      <ScrollView>
        <View style={[styles.inputContainer, { marginTop: state.inputMargin }]}>
          {state.showPrompt && (
            <Text style={styles.promptTextStyle}>
              {" "}
              What food ingredients do you have?
            </Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Chicken,mushroom,spaghetti..."
            value={state.ingredients}
            onChangeText={(text) => dispatch({type:'SET_INGREDIENTS',newIngredients:text})}
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: state.buttonColor }]}
            onPress={handleGetRecipe}
            disabled={state.buttonDisabled}
          >
            <Text style={styles.buttonText}>{state.buttonText}</Text>
          </TouchableOpacity>
          {state.showClearButton && (
            <TouchableOpacity
              style={[styles.clearButton, { backgroundColor: "red" }]}
              onPress={clearButtonFunc}
            >
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {state.error !== "" && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{state.error}</Text>
          </View>
        )}

        {state.loading && <Loading />}
        {state.recipe !== "" && (
          <View style={styles.resultContainer}>
            <Text style={{ fontSize: 18 }}>Your recipe is ready:</Text>
            <Text style={styles.resultText}>{state.recipe}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: "20%",
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
});
