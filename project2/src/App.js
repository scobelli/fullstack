import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class OptionSelect extends React.Component{
  constructor(props){
    super(props)
    this.state = {selectedOption: [], years: [], semesters: [], departments: [],
       CCC: [], index: {
         year:0,
         semester:1,
         department:2,
         CCC:3
       }}
    this.handleSelection = this.handleSelection.bind(this)
  }
  /*
  componentWillMount(){
    fetch('http://eg.bucknell.edu:48484/q?Semester=Fall&Year=2018&limit=50')
      .then(result=>result.json())
      .then(courses=>this.setState({courses:courses.message}))
      .catch(err=>console.log("Couldn't fetch courses", err))
  }
  */
  handleSelection(selectionIndex, event){
    console.log("Selction:", event.target.value)
    console.log("attribute:" event.target.getAttribute)
    this.setState({selectedOption[selectionIndex]:event.target.value})

    // now also trigger the state update in the parent
    this.props.onCourseChange(event.target.value)
  }
  render(){
    var options
    if (this.state.breeds.length === 0)
      options = <option value="loading" key="loading">loading...</option>
    else {
      options = ['--select option--'].concat(this.state.breeds)
        .map(b=>
            <option value={b} key={b}>{b}</option>
          )
    }
    return (
      <div>
        <select onChange={this.handleSelection}>{options}</select>
        { // if breed is selected, show it, else show a friendly message
          (this.state.selectedBreed === null ||
           this.state.selectedBreed === "--select breed--") ?
            <p>Select something!</p> :
            <p>Selected breed is <em>{this.state.selectedBreed}</em></p>
        }
      </div>
    )
  }
}
class DogBreedDisplay extends React.Component {
  constructor(props){
    super(props)
    // load a default placeholder when there is no do breed selected
    this.placeholderurl = 'http://via.placeholder.com/350x350'
    this.state = {imgurl: this.placeholderurl}
  }
  componentWillReceiveProps(newProps){
    if (newProps.breed !== this.props.breed){
      console.log("new breed recieved", newProps.breed)
      //update the image.
      fetch('https://dog.ceo/api/breed/' + newProps.breed + '/images/random')
        .then(resp => resp.json())
        .then(jresp => {
          if (jresp.status === "success")
            this.setState({imgurl:jresp.message})
          else {
            this.setState({imgurl:this.placeholderurl})
          }
        })
        .catch(err => console.log("ERR:", err))
    }
  }
  render(){
    return <img src={this.state.imgurl}/>
  }
}
class DogBreedImgSelect extends React.Component{
  constructor(props){
    super(props)
    // bind this to our event handler!
    this.state = {breed:null}
    this.handleBreedChange = this.handleBreedChange.bind(this)
  }
  handleBreedChange(event){
    console.log("breed changed!", event)

    // this will trigger a render and pass the new breed into the props
    // of DogBreedDisplay
    this.setState({breed:event})
  }
  render(){
    return (
      <div>
        <DogBreedsSelect onBreedChange={this.handleBreedChange}/>
        <DogBreedDisplay breed={this.state.breed}/>
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">

      </div>
    );
  }
}
