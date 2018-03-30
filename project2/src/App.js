import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Grid, Col, Row} from 'react-bootstrap'

class OptionsSelect extends React.Component{
  constructor(props){
    super(props)
    this.state = {selectedOption: "", options: []}
    this.handleSelection = this.handleSelection.bind(this)
  }
  componentWillReceiveProps(newProps){
    if (newProps.options !== this.props.options){
      var options = null;
      if (newProps.options !== null) {
        options = Array.from(new Set(newProps.options.map(course => {
          return course[this.props.type];
        })))
      }
      this.setState({options: options});
    }
  }

  handleSelection(event){
    this.setState({selectedOption: event.target.value})

    // now also trigger the state update in the parent
    this.props.onSelectionChange(this.state.type, event.target.value)
  }
  render(){
    var options;
    if (this.state.options.length === 0 || this.state.options[0] === undefined) {
      options = <option value="loading" key="loading">loading...</option>
    }
    else {
      console.log(this.state.options);
      options = ['--select option--'].concat(this.state.options)
        .map(b =>
            <option value={b._id} key={b._id}>{b[this.state.type]}</option>
          )
    }
    return (
      <div>
        <select onChange={this.handleSelection}>{options}</select>
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
      options: {}, res: {}, types:[
      'department', 'instructor', 'ccceq']
    }

    this.optionsChange = this.optionsChange.bind(this);
  }

  componentWillMount() {
    this.fetchAPI()
  }

  formatQueryString(req) {
    var queryString = "http://eg.bucknell.edu:48484/q?";
    if (req.Department) {
      queryString += "Department=" + req.department + "&"
    }
    if (req.Instructor) {
      queryString += "Instructor=" + req.instructor + "&"
    }
    if (req.CCCReq) {
      queryString += "CCCReq=" + req.CCCReq + "&"
    }
    if (req.text) { 
      queryString += "text=" + req.text + "&"
    }

    return encodeURI(queryString)
  }

  fetchAPI() {
    fetch(this.formatQueryString(this.state.options))
      .then(result=>result.json())
      .then(res=>{
        this.setState({res:res.message})
        this.props.onOptionsChange(res.message)
      })
      .catch(err=>console.log("Couldn't fetch courses", err))
  }

  optionsChange(type, selectedOption) {
    if (type === this.state.types[0]) {
      this.setState(prevState => ({
        options: {
            ...prevState.options,
            department: selectedOption
        }
      }))
    }
    else if (type === this.state.types[1]) {
      this.setState(prevState => ({
        options: {
            ...prevState.options,
            instructor: selectedOption
        }
      }))
    }
    else if (type === this.state.types[2]) {
      this.setState(prevState => ({
        options: {
            ...prevState.options,
            cccreq: selectedOption
        }
      }))
    }
    this.fetchAPI()
  }

  optionsReset() {
    this.setState({options: {
      department: '',
      instructor: '',
      cccreq: ''
    }})
    this.fetchAPI()
  }

  render() {
    return (
     <div>
      <OptionsSelect type='this.state.types[0]' onSelectionChange={this.optionsChange} options={this.state.res}/>
      <OptionsSelect type='this.state.types[1]' onSelectionChange={this.optionsChange} options={this.state.res}/>
      <OptionsSelect type='this.state.types[2]' onSelectionChange={this.optionsChange} options={this.state.res}/>
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
      console.log(this.props.courses);
      this.props.courses.map(
      course => <Col sm={6} md={3} value={course} onClick={this.handleSelection}>{course.Course}</Col>
      )
    }
    return (
    <div>
      <CourseDetails course={this.state.selectedCourse}> </CourseDetails>
      <Grid>
        <Row>
          {courseBoxes}
        </Row>
      </Grid>
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
