import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { InstantDisplay as Instant } from './components/instant/instant.component';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Instant style={styles.instant} />
        <View style={{position:'absolute', backgroundColor:'white', top:0, height:20, width:'100%'}}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  instant: {

  },
});
