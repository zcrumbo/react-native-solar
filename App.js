import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Instant from './components/instant/instant.component';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Instant />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
