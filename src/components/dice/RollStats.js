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
import ProbabilityBars from './ProbabilityBars';

class RollStats extends Component {

  constructor() {
    super();
    this.state = {
      minRange: 0,
      minDamage: 0,
      minSurge: 0
    };
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
    let stats = this.generateStats(outcomes);


    let filteredOutcomes = filter(outcomes, (outcome) =>
      outcome.range >= this.state.minRange && outcome.damage >= this.state.minDamage && outcome.surge >= this.state.minSurge
    );

    const probability = size(filteredOutcomes) / size(outcomes);

    return (
      <Grid>
        <Row>
          <Col xs={3}>
            <DiceFilter label="Target Range"
                        id="minRange"
                        value={this.state.minRange}
                        onChange={this.changeMinRange}/>
          </Col>
          <Col xs={3}>
            <DiceFilter label="Target Damage"
                        id="minDamage"
                        value={this.state.minDamage}
                        onChange={this.changeMinDamage}/>
          </Col>
          <Col xs={3}>
            <DiceFilter label="Target Surges"
                        id="minSurge"
                        value={this.state.minSurge}
                        onChange={this.changeMinSurge}/>
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
        <Row>
          <Col xs={4}>
            <h3>Range</h3>
            <ul>
              <li>Min: {stats.range.min}</li>
              <li>Max: {stats.range.max}</li>
              <li>Avg: {stats.range.avg}</li>
            </ul>
            <ProbabilityGraph data={rangeData.atLeast} title="Range" color="blue"/>
            <ProbabilityBars data={rangeData.exact} title="Range" color="blue"/>
          </Col>
          <Col xs={4}>
            <h3>Damage</h3>
            <ul>
              <li>Min: {stats.damage.min}</li>
              <li>Max: {stats.damage.max}</li>
              <li>Avg: {stats.damage.avg}</li>
            </ul>
            <ProbabilityGraph data={damageData.atLeast} title="Damage" color="red"/>
            <ProbabilityBars data={damageData.exact} title="Damage" color="red"/>
          </Col>
          <Col xs={4}>
            <h3>Surge</h3>
            <ul>
              <li>Min: {stats.surge.min}</li>
              <li>Max: {stats.surge.max}</li>
              <li>Avg: {stats.surge.avg}</li>
            </ul>
            <ProbabilityGraph data={surgeData.atLeast} title="Surge" color="gold"/>
            <ProbabilityBars data={surgeData.exact} title="Surge" color="gold"/>
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
    let combinedOutcomes = [];
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
    let values = map(keys(byProp), (val) => parseInt(val, 10));
    let maxValue = max(values);
    let valueRange = range(maxValue + 2);

    let exact = map(valueRange, function (value) {
      let probability = Math.round((size(byProp[value]) / size(outcomes)) * 10000) / 100;
      return {x: value, y: probability}
    });

    let totalProbability = 100.00;
    let atLeast = map(exact, function (value) {
      let result = {x: value.x, y: totalProbability};
      totalProbability = Math.round((totalProbability - value.y) * 100) / 100;
      return result;
    });

    return {exact: exact, atLeast: atLeast};
  }

}

RollStats.defaultProps = {
  dice: []
}

export default RollStats;
