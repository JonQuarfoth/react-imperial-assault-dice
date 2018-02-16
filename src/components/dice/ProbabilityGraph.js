import React, { Component } from 'react';
import {FlexibleWidthXYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';
import 'react-vis/dist/style.css';

class ProbabilityGraph extends Component {
	render() {


		return (
			<FlexibleWidthXYPlot height={300}>
			  <HorizontalGridLines />
			  <LineSeries
			    color="red"
			    data={this.props.data}/>
			  <XAxis title={this.props.title} />
			  <YAxis title="Probability"/>
			</FlexibleWidthXYPlot>
		);
	}
}

export default ProbabilityGraph