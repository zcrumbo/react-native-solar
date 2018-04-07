import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { InstantDisplay as Instant } from './components/instant/instant.component';

export default class App extends React.Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Instant style={styles.instant} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  instant: {
    flex:1,
    flexDirection: 'row',
  }
});
