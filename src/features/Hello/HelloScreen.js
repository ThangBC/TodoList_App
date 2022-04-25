import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import {colors} from '../../constraints/';

const HelloScreen = props => {
  const {navigation, route} = props;
  const {navigate, goBack} = navigation;
  useEffect(() => {
    setTimeout(() => {
      navigate('HomeScreen');
    }, 2000);
  });
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.background}
        source={require('../../assets/background.jpg')}
        resizeMode={'cover'}>
        <Image
          style={styles.logoApp}
          source={require('../../assets/logo.png')}
        />
        <Text style={styles.nameApp}>To-Do List</Text>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  background: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  logoApp: {
    width: 150,
    height: 150,
  },
  nameApp: {
    color: colors.primaryColor,
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 30,
  },
});

export default HelloScreen;
