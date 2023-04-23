import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useContext } from "react";
import Loading from "./Loading";
import Title from "./Title";
import AppContext from "../context/MainContext";


const Main = () => {
  const {state,handleGetRecipe,clearButtonFunc,dispatch} = useContext(AppContext);

  return (
    <View testID="main-view" style={styles.container}>
        <View testID="title-wrapper" style={styles.titleWrapper}>
            <Title titleFontSize={state.titleFontSize}/>
            
        </View>
        <ScrollView testID="scroll-view">
            <View testID="input-container" style={[styles.inputContainer, { marginTop: state.inputMargin }]}>
                {state.showPrompt && (
                    <Text testID="prompt-text" style={styles.promptTextStyle}>{state.promptText}</Text>
                )}
                <TextInput
                    testID="ingredient-input"
                    style={styles.input}
                    placeholder={ state.language === 'english' ? 
                        state.ingredients_value.english[
                            (Math.random() * state.ingredients_value.english.length) | 0
                        ] :
                        state.ingredients_value.turkish[
                          (Math.random() * state.ingredients_value.turkish.length) | 0
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
    <View style={styles.resultTextWrapper}>
      <Text testID="recipe-results" style={styles.resultText}>
        {state.recipe}
      </Text>
    </View>
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
  resultTextWrapper: {
    paddingHorizontal: 8, 
  },

  resultText: {
    color: "#333333",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "justify", 
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

export default Main;
