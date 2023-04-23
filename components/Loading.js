import { StyleSheet, Text, View,Image } from 'react-native'
import React from 'react'
import './loading.gif'


const Loading = () => {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={require('./loading.gif')}
        style={{ width: 260, height: 260 }}
        testID="loading-image"
      />
    </View>
  );
};





export default Loading;