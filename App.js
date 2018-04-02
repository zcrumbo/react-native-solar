import React from 'react';
import { StyleSheet, View } from 'react-native';
import { InstantDisplay as Instant } from './components/instant/instant.component';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Instant style={styles.instant} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instant: {
    flex:1,
    flexDirection: 'row',
  }
});
