import React, { Component } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import isEmpty from 'lodash/isEmpty'
import RollStats from './RollStats'

const blue = {
	id: 'blue',
	className: 'primary',
	outcomes: [
		{ range: 2, damage: 0, surge: 1 },
		{ range: 2, damage: 1, surge: 0 },
		{ range: 3, damage: 2, surge: 0 },
		{ range: 3, damage: 1, surge: 1 },
		{ range: 4, damage: 2, surge: 0 },
		{ range: 5, damage: 1, surge: 0 },
	]
}
const green = {
	id: 'green',
	className: 'success',
	outcomes: [
		{ range: 1, damage: 0, surge: 1 },
		{ range: 1, damage: 1, surge: 1 },
		{ range: 1, damage: 2, surge: 0 },
		{ range: 2, damage: 1, surge: 1 },
		{ range: 2, damage: 2, surge: 0 },
		{ range: 3, damage: 2, surge: 0 },
	]
}
const yellow = {
	id: 'yellow',
	className: 'warning',
	outcomes: [
		{ range: 0, damage: 0, surge: 1 },
		{ range: 0, damage: 1, surge: 2 },
		{ range: 1, damage: 2, surge: 0 },
		{ range: 1, damage: 1, surge: 1 },
		{ range: 2, damage: 0, surge: 1 },
		{ range: 2, damage: 1, surge: 0 },
	]
}
const red = {
	id: 'red',
	className: 'danger',
	outcomes: [
		{ range: 0, damage: 1, surge: 0 },
		{ range: 0, damage: 2, surge: 0 },
		{ range: 0, damage: 2, surge: 1 },
		{ range: 0, damage: 2, surge: 0 },
		{ range: 0, damage: 3, surge: 0 },
		{ range: 0, damage: 3, surge: 0 },
	]
}

class DiePool extends Component {

	constructor() {
		super()
		this.state = {
			dice: []
		}

		this.addBlue = this.addDie.bind(this, blue);
		this.addGreen = this.addDie.bind(this, green);
		this.addYellow = this.addDie.bind(this, yellow);
		this.addRed = this.addDie.bind(this, red);
		this.clearPool = this.clearPool.bind(this);
	}

	render() {

		const dice = this.state.dice.map((die, index) => 
			<li key={index} className={'text-' + die.className}>{die.id.toUpperCase()}</li>
		)
		return (
			<div>
				<div>
					<ButtonToolbar>
						<Button bsSize="large" bsStyle={blue.className} onClick={this.addBlue}>+ Blue</Button>
						<Button bsSize="large" bsStyle={green.className} onClick={this.addGreen}>+ Green</Button>
						<Button bsSize="large" bsStyle={yellow.className} onClick={this.addYellow}>+ Yellow</Button>
						<Button bsSize="large" bsStyle={red.className} onClick={this.addRed}>+ Red</Button>
						<Button bsSize="large" disabled={isEmpty(this.state.dice)} onClick={this.clearPool}>Reset</Button>
					</ButtonToolbar>
				</div>
				<div>
					Current Dice:
					<ul>
						{dice}
					</ul>
				</div>
				<div>
					<RollStats dice={this.state.dice}/>
				</div>
			</div>
		);
	}

	addDie(die) {
		this.setState((state, props) => ({dice: state.dice.concat([die])}));
	}

	clearPool() {
		this.setState({ dice: []});
	}
}

export default DiePool























