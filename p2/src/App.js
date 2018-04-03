import React, { Component } from 'react';
import './App.css';
import {Grid, Col, Row} from 'react-bootstrap'

class OptionsSelect extends React.Component{
  constructor(props){
    super(props)
    this.state = {selectedOption: ""}
    this.handleSelection = this.handleSelection.bind(this)
  }

  handleSelection(event){
    this.setState({selectedOption: event.target.value})
    console.log("Onchange")
    // now also trigger the state update in the parent
    event.preventUpdate = true;
    this.props.onSelectionChange(this.props.type, event.target.value)
  }
  render(){
    var options;
    if (this.props.options.length === 0 || this.props.options[0] === undefined) {
      options = <option value="loading" key="loading">loading...</option>
    }
    else {
      options = ["All"].concat(this.props.options)
        .map((b, index) =>
            <option value={b} key={index +1}>{b}</option>
          )
    }
    return (
      <div>
        <select onChange={(e) => this.handleSelection(e)}>{options}</select>
        {
          (this.state.selectedOption === null ||
           this.state.selectedOption === "--select option--") ?
            <p>Select Option!</p> :
            <p>Selected option is <em>{this.state.selectedOption}</em></p>
        }
      </div>
    )
  }
}

class CourseOptionContainer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      optionValues: [[""],[""],[""]],
      options: {Department:"", Instructor:"", CCCReq:"", Text:""}, res: [], types:[
      'Department', 'Instructor', 'CCCReq']
    }

    this.optionsChange = this.optionsChange.bind(this);
    this.fetchAPI = this.fetchAPI.bind(this)
  }

  componentWillMount() {
    this.fetchAPI(this.state.options)
  }

  formatQueryString(req) {
    var queryString = "http://eg.bucknell.edu:48484/q?limit=3345&";
    for (let i = 0; i < this.state.types.length; i++) {
      if (req[this.state.types[i]] !== "" && req[this.state.types[i]] !== "All") {
        queryString += this.state.types[i] + "=" + req[this.state.types[i]] + "&"
      }
    }
    return encodeURI(queryString)
  }

  fetchAPI(req) {
    console.log(this.formatQueryString(req) + " was fetched")
    fetch(this.formatQueryString(req))
      .then(result=>result.json())
      .then(res=>{
        this.props.onOptionsChange(res.message)
        res = res.message
        var optionValues = [[""],[""],[""]];
        if (res.length !== 0 || res[0] !== undefined) {
          for (var i = 0; i < this.state.types.length; i++) {
            if (this.state.options[this.state.types[i]] === "") {
              optionValues[i] = Array.from(new Set(res.map((course, index) => {
                if (i === 2) {
                  return [].concat(...(course[this.state.types[i]]))
                }
                return course[this.state.types[i]];
                })))
            }
            else {
              optionValues[i] = this.state.optionValues[i]
            }
          }
        }
        console.log(req)
        this.setState({optionValues: optionValues, options: req})
      }).catch(e => console.log(e))
  }
  
  optionsChange(type, selectedOption) {
    var options = this.state.options;
    options[type] = selectedOption;
    console.log(type)
    this.fetchAPI(options)
  }

  optionsReset() {
    this.setState({options: {
      department: '',
      instructor: '',
      cccreq: ''
    }}, this.fetchAPI(this.state.options))
  }

  render() {
    return (
     <div>
      <OptionsSelect type={this.state.types[0]} onSelectionChange={this.optionsChange} options={this.state.optionValues[0]}/>
      <OptionsSelect type={this.state.types[1]} onSelectionChange={this.optionsChange} options={this.state.optionValues[1]}/>
      <OptionsSelect type={this.state.types[2]} onSelectionChange={this.optionsChange} options={this.state.optionValues[2]}/>
    </div>
  )}

}


class CourseDetails extends React.Component{
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    var details
    if (this.props.course === null) {

    } else {
      details = (
        <Col>
          <h1>{this.props.course.Course}</h1>
          <p>{this.props.course.Instructor}</p>
          <p>{this.props.course.CCCReq}</p>
          <p>{this.props.course.CRN}</p>
          <p>{this.props.course.CCCReq}</p>
        </Col>
      )
    }
    return (
      <div>
        <Grid>
          <Row>
            {details}
          </Row>
        </Grid>
      </div>
    )
  }
}

class CourseView extends React.Component{
  constructor(props){
    super(props)
    // bind this to our event handler!
    this.state = {selectedCourse:null}
    this.handleSelection = this.handleSelection.bind(this);
  }

  componentWillReceiveProps() {
    this.setState({selectedCourse: null})
  }
  handleSelection (event) {
    this.setState({selectedCourse: event.target.value})
  }
  render() {
    var courseBoxes;
    if (this.props.courses === null) {
      courseBoxes = (<p> Select Classes!</p>);
    } else {
      courseBoxes = this.props.courses.map(
        (course, index) => (<Col sm={6} md={3} lg={3} value={course} key={index} onClick={this.handleSelection}>{course.Course}</Col>)
      )

    }
    return (
    <div>
      <div>
      <CourseDetails course={this.state.selectedCourse}> </CourseDetails>
      </div>
      <div>
      <Grid>
        <Row>
          {courseBoxes}
        </Row>
      </Grid>
      </div>
    </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {courses: null}
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(courses) {
    this.setState({courses: courses});
  }

  render() {
    return (
      <div className="App">
	     <CourseOptionContainer onOptionsChange={this.handleChange}/>
       <CourseView courses={this.state.courses}/>
      </div>
    );
  }
}



export default App
