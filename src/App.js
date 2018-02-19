import React, {Component} from 'react';
import {Navbar, Grid, Row, Col} from 'react-bootstrap';
import './App.css';
import DiePool from './components/dice/DiePool'

class App extends Component {
  render() {
    return (
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              Imperial Assault Dice Stats
            </Navbar.Brand>
          </Navbar.Header>
        </Navbar>
        <Grid>
          <Row>
            <DiePool/>
          </Row>
          <Row>
            <Col xs={12} sm={10} smOffset={1} md={8} mdOffset={2}>Stuff</Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
