import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap'

class DiceFilter extends Component {

	constructor() {
		super();
		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(e) {
	  this.props.onChange(e.target.value);
	}

	render() {
		const value = this.props.value;
		const label = this.props.label;
		const id = this.props.id

		return (
			<FormGroup
	          controlId={id}
	        >
	          <ControlLabel>{label}</ControlLabel>
	          <FormControl
	            type="number"
	            min="0"
	            value={value}
	            placeholder="Enter text"
	            onChange={this.handleChange}
	          />
	        </FormGroup>
		);
	}
}

export default DiceFilter