import React, { Component } from 'react';
import each from 'lodash/each'
import head from 'lodash/head'
import tail from 'lodash/tail'
import isEmpty from 'lodash/isEmpty'
import size from 'lodash/size'
import { Grid, Row, Col } from 'react-bootstrap';


class RollStats extends Component {

	constructor() {
		super();
		this.generateOutcomes = this.generateOutcomes.bind(this);
		this.combineOutcomes = this.combineOutcomes.bind(this);
		this.generateStats = this.generateStats.bind(this);
	}

	render() {
		let outcomes = this.generateOutcomes(this.props.dice);
		if (isEmpty(outcomes)) {
			return null;
		}

		let stats = this.generateStats(outcomes);
		
		return (
			<Grid>
				<Row>
					<Col xs={3}>
						<h3>Range</h3>
						<ul>
							<li>Min: {stats.range.min}</li>
							<li>Max: {stats.range.max}</li>
							<li>Avg: {stats.range.avg}</li>
						</ul>
					</Col>
					<Col xs={3}>
						<h3>Damage</h3>
						<ul>
							<li>Min: {stats.damage.min}</li>
							<li>Max: {stats.damage.max}</li>
							<li>Avg: {stats.damage.avg}</li>
						</ul>
					</Col>
					<Col xs={3}>
						<h3>Surge</h3>
						<ul>
							<li>Min: {stats.surge.min}</li>
							<li>Max: {stats.surge.max}</li>
							<li>Avg: {stats.surge.avg}</li>
						</ul>
					</Col>
				</Row>
			</Grid>
		);
	}

	generateOutcomes(dice) {
		if (isEmpty(dice)) {
			return [];
		}
		let totalOutcomes = head(dice).outcomes;
		each(tail(dice), (die) => {
			totalOutcomes = this.combineOutcomes(totalOutcomes, die.outcomes);
		});
		return totalOutcomes;
	}

	combineOutcomes(outcome1, outcome2) {
		let combinedOutcomes = []
		each(outcome1, (o1) => {
			each (outcome2, (o2) => {
				combinedOutcomes.push({
					range: o1.range + o2.range,
					damage: o1.damage + o2.damage,
					surge: o1.surge + o2.surge
				});
			});
		});
		return combinedOutcomes;
	}

	generateStats(outcomes) {
		let tally = {
			total: size(outcomes)
		};
		let values = ['range', 'damage', 'surge'];

		each(values, (value) => {
			tally[value] = {
				sum: 0,
				min: Number.MAX_SAFE_INTEGER,
				max: 0
			}
		});

		each(outcomes, (outcome) => {
			each(values, (value) => {
				let outcomeValue = outcome[value];
				let tallyValue = tally[value];

				tallyValue.sum += outcomeValue;
				if (outcomeValue < tallyValue.min) {
					tallyValue.min = outcomeValue;
				}
				if (outcomeValue > tallyValue.max) {
					tallyValue.max = outcomeValue;
				}
			});
		});

		let result = {};
		each(values, (value) => {
			let tallyValue = tally[value];
			result[value] = {
				min: tallyValue.min,
				max: tallyValue.max,
				avg: Math.round((tallyValue.sum / tally.total) * 100) / 100
			}
		});
		return result;
	}

}

RollStats.defaultProps = {
	dice: []
}

export default RollStats;
