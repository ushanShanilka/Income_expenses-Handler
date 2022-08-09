import React, { Component } from 'react';
import { View, Text,Picker } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default class Sample extends Component {
  constructor(props) {
    super(props);
    this.state = {
        choosenIndex: 0,
        resp:[],
        tableHead: ['Category'],
        
    };
    this.getData();
  }

  getData() {
    fetch('http://192.168.8.202:3000/CategoryRouter/categorys')
      .then((response) => response.json())
        .then((response) => {
           let resp=response.data
            //console.log(resp[0].category)
                this.setState({ resp })               
        })
     .catch((error) => console.error(error));
}

  render() {
    const dropDown = this.state.resp.map(record => ([record.category]));
    console.log(dropDown);
    var array = this.state.resp.proty
    return (
      <View>
        <Picker
            selectedValue = {this.state.language}
            onValueChange={(itemValue, itemPosition)=> this.setState({language: itemValue, choosenIndex: itemPosition})}
        >
        {
          dropDown.map((rowData,index) => (
            <Picker.Item value={rowData} key={index} />
          ))
            // <Picker.Item label="Android" value="Android"/>
            // <Picker.Item label="Java" value="Java"/>
            // <Picker.Item label="Pakaya" value="Pakaya"/>
        }
        </Picker>
        <Text>{this.state.language}</Text>
      </View>
    );
  }
}
