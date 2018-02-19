import React, {Component} from 'react';
import {FlexibleWidthXYPlot, XAxis, YAxis, HorizontalGridLines, VerticalBarSeries, Crosshair} from 'react-vis';
import 'react-vis/dist/style.css';
import find from "lodash/find";

class ProbabilityBars extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nearestX: []
    }
  }


  render() {
    const {data, title, color} = this.props;
    const nearestX = this.state.nearestX;

    const findDatapointByX = (series, x) => find(series, (point) => point.x === x);
    const titleFormat = (points) => ({title: title, value: points ? points[0].x : 0});
    const itemsFormat = (points) => points.map((point) => ({title: 'Odds of rolling ' + point.x, value: point.y + '%'}));

    return (
      <FlexibleWidthXYPlot
        height={300}
        onMouseLeave={() => this.setState({nearestX: []})}>
        <HorizontalGridLines/>
        <VerticalBarSeries
          color={color}
          data={data}
          onNearestX={(point) => this.setState({nearestX: [findDatapointByX(data, point.x)]})}/>
        <Crosshair
          values={nearestX}
          titleFormat={titleFormat}
          itemsFormat={itemsFormat}/>
        <XAxis title={title} tickValues={data.map(p => p.x)}/>
        <YAxis title="Odds"/>
      </FlexibleWidthXYPlot>
    );
  }
}

export default ProbabilityBars
