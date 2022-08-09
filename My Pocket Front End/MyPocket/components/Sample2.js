import React, { Component } from 'react';
import { View, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default class Sample2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
  //  open: false,
  //     value: null,
  //     resp:[]
    };
    this.getData();
    //this.setValue = this.setValue.bind(this);
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


  setOpen(open) {
    this.setState({
      open
    });
  }

  setValue(callback) {
    this.setState(state => ({
      value: callback(state.value)
    }));
  }

  setItems(callback) {
    this.setState(state => ({
      items: callback(state.items)
    }));
  }

  render() {
    const { open, value, items } = this.state;

    return (
      <DropDownPicker
        // open={open}
        // value={value}
        // items={items}
        // setOpen={setOpen}
        // setValue={setValue}
        // setItems={setItems}
      
      />
    );
  }
}