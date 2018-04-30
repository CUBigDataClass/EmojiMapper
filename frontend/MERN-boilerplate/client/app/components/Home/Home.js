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
      locations: ['none'],
      emoji: []
    };

    this.getHashTags = this.getHashTags.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.getEmoji = this.getEmoji.bind(this);
    this.dateFormat = '';
    this.trendData = '';
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
    fetch(`/api/test/${this.dateFormat}/${trend}`)
      .then(res => res.json())
      .then(json => {
        this.setState({
          locations : json[0].locations[this.state.picklistValue]
        })
      });
  }

  getEmoji() {
    fetch(`/api/emoji/${this.dateFormat}/${this.trendData}`)
      .then(res => res.json())
      .then(json => {
        this.setState({
          emoji : json,
        })
        console.log(this.state.emoji);
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
    let trend = value.value;
    let trends = trend.match('#') ? trend.replace('#', '%23') : trend;
    this.getLocation(trends);
    this.trendData = trends;
    this.getEmoji();
  }

  render() {
    const styles = {
      display: 'inline-flex',
      width: '60%', 
    }

    const styles2 = {
      paddingRight: '60px'
    }

    const listStyle = {
      paddingLeft: '60px'
    }

    return (
      <div style={styles}>
        <div style={styles2}>
            <DatePicker
              onChange={this.onChange.bind(this)}
              value={this.state.date}
            />
        </div>
          <div>
            <Dropdown options={this.state.picklistOptions} onChange={this.handlePicklistValueChange.bind(this)} value={this.state.picklistValue} placeholder="Select an option" />
          </div>
          <div style={listStyle}>
            <ul>
                {this.state.locations.map(function(name, index){
                  if(index)
                    return <li key={ index }>{name}</li>;
                  })}
            </ul>
          </div>
      </div>
    );
  }
}
export default Home;