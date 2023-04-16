import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, SafeAreaView, StyleSheet,ScrollView } from 'react-native';
import Loading from './components/Loading.js';


const App = () => {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState('');
  const [error, setError] = useState('');
  const [loading,setLoading] = useState(false);
  const [buttonText, setButtonText] = useState('Get Recipe');
  const [buttonDisabled,setButtonDisabled] = useState(0);
  const [buttonColor,setButtonColor] = useState('#00AEEF');
  const [inputMargin,setInputMargin] = useState('50%');
  const [showPrompt,setShowPrompt] = useState(true);
  const [showClearButton,setShowClearButton] = useState(false);
  const [titleFontSize,setTitleFontSize] = useState(42);


  const clearButtonFunc = ()=>{
    setIngredients('');
    setRecipe('');
    setShowClearButton(false);
    setInputMargin('50%');
    setButtonColor('#00AEEF');
    setShowPrompt(true);
    setTitleFontSize(42);
    setButtonText('Get Recipe');



  }
  const handleGetRecipe = async () => {
    if (ingredients.trim() === '') {
      setError('please enter ingredients.');
      return;
    }

    try {
      setLoading(true);
      setButtonDisabled(1);
      setButtonColor('grey');
      setButtonText('Recipe being prepared...');
      setRecipe('');
      setInputMargin(0);
      setShowPrompt(false);
      setTitleFontSize(36);
      
      
      if (error){
        setError('');
      }
      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer <token>`,
        },
        body: JSON.stringify({
          "model": "text-davinci-003",
          "temperature": 0,
          "prompt": `Here are the food ingredients I have: ${ingredients}. Give a recipe that can be made with these ingredients.`,
          "max_tokens": 2000,
          "top_p": 1
        }),
      });
      setLoading(false);
      setButtonDisabled(0);
      if (ingredients !== '' ){
        setButtonText('Find Another Recipe')
        setButtonColor('green');
      }
      const data = await response.json();
      console.log(data);
      const recipeText = data.choices[0].text;
      const formattedRecipe = formatRecipe(recipeText);
      setRecipe(formattedRecipe);
      setError('');
      setShowClearButton(true);
    } catch (error) {
      console.error(error);
      setError('An error occurred while getting the recipe.');
    }
  };

  const formatRecipe = (recipeText) => {
    const recipeLines = recipeText.split('\n');
  
    const recipeName = recipeLines[0].trim();
  
    const ingredients = recipeLines.slice(1, recipeLines.length - 1).join('\n');
  
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
    <SafeAreaView style={styles.container}>
      <View style={styles.titleWrapper}>
          <Text style={{fontSize:titleFontSize}}>
            ChefAI
          </Text>
          
        </View>
      <ScrollView>
        
      <View style={[styles.inputContainer,{marginTop:inputMargin}]}>
        {showPrompt && <Text> What food ingredients do you have?</Text>}
        
        <TextInput
          style={styles.input}
          placeholder="Chicken,mushroom,spaghetti..."
          value={ingredients}
          onChangeText={(text) => setIngredients(text)}
        />
        <TouchableOpacity
          style={[styles.button,{backgroundColor:buttonColor}]}
          onPress={handleGetRecipe}
          disabled={buttonDisabled}
          >
          
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
        {showClearButton && <TouchableOpacity
          style={[styles.clearButton,{backgroundColor:'red'}]}
          onPress={clearButtonFunc}
          >
          
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity> }
        
      </View>
      
      {error !== '' && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {loading && 
            <Loading/>
          }
      {recipe !== '' && (
        <View style={styles.resultContainer}>
          <Text style={{fontSize:18}}>Your recipe is ready:</Text>
          <Text style={styles.resultText}>{recipe}</Text>
        </View>
      )}
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 45,
    marginHorizontal: 8,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 24,
    marginHorizontal: 16,
    paddingVertical: 8,

  },
  input: {
    fontSize: 16,
    marginTop:16,
    backgroundColor:'#e3e1e6',
    borderRadius:10,
    borderWidth:10,
    borderColor:'#e3e1e6',
    paddingHorizontal:5,
    
  },
  button: {
    borderRadius: 8,
    marginTop: 16,
    paddingVertical: 8,
  },
  clearButton:{
    borderRadius: 8,
    marginTop: 16,
    paddingVertical: 8,
    width:100,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: 16,
    marginHorizontal: '5%',
    
  },
  resultText: {
    color: '#333333',
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 16,
    marginHorizontal: 16,
    paddingVertical: 8,
    borderColor: 'red',
    borderWidth: 2,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titleWrapper:{
    marginTop:16,
    marginHorizontal:16,
  },
  
  
  
  
  
});

export default App;
