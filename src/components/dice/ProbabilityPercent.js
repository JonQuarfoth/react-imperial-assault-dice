import React, {Component} from 'react';

class ProbabilityPercent extends Component {
  render() {
    const val = this.props.value;
    const percent = Math.round(val * 10000) / 100;
    let className;
    if (percent < 25) {
      className = 'text-danger'
    } else if (percent < 50) {
      className = 'text-warning'
    } else if (percent < 75) {
      className = 'text-primary'
    } else {
      className = 'text-success'
    }

    return (
      <span className={className}>{percent}%</span>
    );
  }
}

export default ProbabilityPercent
