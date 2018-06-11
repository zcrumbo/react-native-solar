import React, { Component } from 'react';
import { View } from 'react-native';

export class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View>
        <View
          style={{ width: 50, height: 50, backgroundColor: 'powderblue' }}
        />
      </View>
    );
  }
}
