import React, { Component } from 'react';
import 'whatwg-fetch';
import DatePicker from 'react-date-picker';
import Picker from 'react-picker';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: new Date(),
      picklistOptions: ['none'],
      picklistValue: '',
      locations: ['none']
    };

    this.getHashTags = this.getHashTags.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.dateFormat = '';
  }

  getHashTags(date) {
    fetch(`/api/test/${date}`)
      .then(res => res.json())
      .then(json => {
        this.setState({
          picklistOptions : json[0].trends
        })
      });
  }

  getLocation(trend) {
    let trends = trend.match('#') ? trend.replace('#', '%23') : trend;
    fetch(`/api/test/${this.dateFormat}/${trends}`)
      .then(res => res.json())
      .then(json => {
        this.setState({
          locations : json[0].locations[this.state.picklistValue]
        })
      });
  }

  onChange(date) {
    const newDateFormat = date.toISOString().slice(0,10); 
    this.dateFormat = newDateFormat;
    this.setState({ date });
    this.getHashTags(newDateFormat);
  }

  handlePicklistValueChange(value) {
    this.setState({ picklistValue : value.value });
    this.getLocation(value.value);
  }

  render() {
    const styles = {
      display: 'inline-flex',
      width: '60%', 
    }

    const styles2 = {
      paddingRight: '20px',
      float:'right'
    }

    return (
      <div style={styles}>
        <div>
            <DatePicker
              onChange={this.onChange.bind(this)}
              value={this.state.date}
            />
        </div>
        <br/>
        <br/>
          <div styles={styles2}>
            <Dropdown options={this.state.picklistOptions} onChange={this.handlePicklistValueChange.bind(this)} value={this.state.picklistValue} placeholder="Select an option" />
          </div>
        <br/>
        <br/>
          <div>
            {this.state.locations}
          </div>
      </div>
    );
  }
}

export default Home;