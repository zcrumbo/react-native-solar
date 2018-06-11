import React, { Component } from 'react';
import { StackedAreaChart } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
export class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    // TODO replace test data with real data
    const data = [
      {
        month: new Date(2015, 0, 1),
        generated: 3840,
        consumed: 1920,
      },
      {
        month: new Date(2015, 1, 1),
        generated: 1600,
        consumed: 1440,
      },
      {
        month: new Date(2015, 2, 1),
        generated: 640,
        consumed: 960,
      },
      {
        month: new Date(2015, 3, 1),
        generated: 3320,
        consumed: 480,
      },
    ];

    const colors = ['#8800cc', '#aa00ff'];
    const keys = ['generated', 'consumed'];
    const svgs = [
      { onPress: () => console.log('generated') },
      { onPress: () => console.log('consumed') },
    ];

    return (
      <StackedAreaChart
        style={{ height: 200, paddingVertical: 16 }}
        data={data}
        keys={keys}
        colors={colors}
        curve={shape.curveNatural}
        showGrid={false}
        svgs={svgs}
      />
    );
  }
}
