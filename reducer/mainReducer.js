const mainReducer = (state, action) => {
    switch (action.type) {
      case "RESTART_SCREEN":
        return {
          ...state,
          ingredients: "",
          recipe: "",
          buttonText: state.language === 'english' ? 'Get Recipe' : 'Tarif Al',
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

export default mainReducer