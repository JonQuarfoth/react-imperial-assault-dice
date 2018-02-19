import React, {Component} from 'react';
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import each from 'lodash/each';
import head from 'lodash/head';
import tail from 'lodash/tail';
import isEmpty from 'lodash/isEmpty';
import size from 'lodash/size';
import filter from 'lodash/filter';
import map from 'lodash/map';
import groupBy from 'lodash/groupBy';
import max from 'lodash/max';
import range from 'lodash/range';
import keys from 'lodash/keys';
import DiceFilter from './DiceFilter';
import ProbabilityPercent from './ProbabilityPercent';
import ProbabilityGraph from './ProbabilityGraph';

class RollStats extends Component {

  constructor() {
    super();
    this.state = {
      minRange: 0,
      minDamage: 0,
      minSurge: 0
    }
    this.generateOutcomes = this.generateOutcomes.bind(this);
    this.combineOutcomes = this.combineOutcomes.bind(this);
    this.generateStats = this.generateStats.bind(this);
    this.formatData = this.formatData.bind(this);
    this.changeMinRange = this.changeMinRange.bind(this);
    this.changeMinDamage = this.changeMinDamage.bind(this);
    this.changeMinSurge = this.changeMinSurge.bind(this);
  }

  changeMinRange(minRange) {
    this.setState({minRange: minRange});
  }

  changeMinDamage(minDamage) {
    this.setState({minDamage: minDamage});
  }

  changeMinSurge(minSurge) {
    this.setState({minSurge: minSurge});
  }

  render() {
    let outcomes = this.generateOutcomes(this.props.dice);
    if (isEmpty(outcomes)) {
      return null;
    }

    let rangeData = this.formatData('range', outcomes);
    let damageData = this.formatData('damage', outcomes);
    let surgeData = this.formatData('surge', outcomes);


    let filteredOutcomes = filter(outcomes, (outcome) =>
      outcome.range >= this.state.minRange && outcome.damage >= this.state.minDamage && outcome.surge >= this.state.minSurge
    )
    const probability = size(filteredOutcomes) / size(outcomes)

    let stats = this.generateStats(filteredOutcomes);

    return (
      <Grid>
        <Row>
          <Col xs={3}>
            <DiceFilter label="Target Range" id="minRange" value={this.state.minRange} onChange={this.changeMinRange}/>
            <h3>Range</h3>
            <ul>
              <li>Min: {stats.range.min}</li>
              <li>Max: {stats.range.max}</li>
              <li>Avg: {stats.range.avg}</li>
            </ul>
            <ProbabilityGraph data={rangeData} title="Range"/>
          </Col>
          <Col xs={3}>
            <DiceFilter label="Target Damage" id="minDamage" value={this.state.minDamage}
                        onChange={this.changeMinDamage}/>
            <h3>Damage</h3>
            <ul>
              <li>Min: {stats.damage.min}</li>
              <li>Max: {stats.damage.max}</li>
              <li>Avg: {stats.damage.avg}</li>
            </ul>
            <ProbabilityGraph data={damageData} title="Damage"/>
          </Col>
          <Col xs={3}>
            <DiceFilter label="Target Surges" id="minSurge" value={this.state.minSurge} onChange={this.changeMinSurge}/>
            <h3>Surge</h3>
            <ul>
              <li>Min: {stats.surge.min}</li>
              <li>Max: {stats.surge.max}</li>
              <li>Avg: {stats.surge.avg}</li>
            </ul>
            <ProbabilityGraph data={surgeData} title="Surge"/>
          </Col>
          <Col xs={3}>
            <FormGroup>
              <ControlLabel>Chance To Roll at least target</ControlLabel>
              <FormControl.Static>
                <ProbabilityPercent value={probability}/>
              </FormControl.Static>
            </FormGroup>
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
      each(outcome2, (o2) => {
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

  formatData(prop, outcomes) {
    let byProp = groupBy(outcomes, prop);
    let values = keys(byProp);
    let maxValue = max(values, parseInt);
    let valueRange = range(parseInt(maxValue) + 2);
    let data = map(valueRange, function (value) {
      let probability = Math.round((size(byProp[value]) / size(outcomes)) * 10000) / 100;
      return {x: value, y: probability};
    });
    return data;
  }

}

RollStats.defaultProps = {
  dice: []
}

export default RollStats;
