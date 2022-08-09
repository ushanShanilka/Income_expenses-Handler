import React, {Component} from 'react';
import {
  View,
  Alert,
  ScrollView,
  Modal,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Picker,
} from 'react-native';
import {DataTable} from 'react-native-paper';
import {Table, TableWrapper, Row} from 'react-native-table-component';
import RNPickerSelect from 'react-native-picker-select';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Expense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      currentlyIncome: '',
      details: '',
      category: '',
      date: '',
      price: '',
      tempMonth: new Date().getMonth() + 1,
      tempYear: new Date().getFullYear(),

      resp: [],
      tableHead: ['Details', 'Category', 'Price'],
      widthArr: [120, 120, 158],
      income: [],

      incomeval: 0,
      expenseval: 0,
      blance: 0,
    };
    this.getData();
    this.getIncome();
  }

  // loadData = async () => {
  //   try {
  //     const val = await AsyncStorage.getItem('val')
  //     console.log("val" + val)
  //     this.setState({currentlyIncome : val})
  //   } catch(e) {
  //     console.log("Data ne!")
  //     Massage
  //   }
  // }

  getIncome() {
    fetch('http://192.168.8.202:3000/IncomeRouter/income')
      .then(response => response.json())
      .then(response => {
        let income = response.data;
        this.setState({income});
        //console.log(income);
        this.calTotal();
        this.generateBance();
      })
      .catch(error => console.error(error));
  }

  calTotal() {
    let aaa = 0;
    this.state.income.map(income => (aaa = aaa + income.income));
    console.log('Income eka  :' + aaa);
    this.setState({incomeval: aaa});
  }

  // calTotal(){
  //   let aaa=0
  //     this.state.resp.map((resp)=>(
  //      aaa=aaa+resp.income
  //       ))
  //    console.log(aaa)
  //    this.setState({tot : aaa})
  // }

  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };

  back = () => {
    console.log('Bck');
    this.props.navigation.navigate('Loging');
  };

  cleatText() {
    this.setState({
      details: '',
      category: '',
      date: '',
      price: '',
    });
  }

  saveExpense() {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    const today = date + '-' + month + '-' + year;
    console.log('today  :' + today);

    fetch('http://192.168.8.202:3000/ExpenseRouter/expense', {
      method: 'POST',
      body: JSON.stringify({
        details: this.state.details,
        category: this.state.category,
        date: today,
        price: this.state.price,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(json => this.getData());

    Alert.alert('Expense Save Una..!');
    this.state.modalVisible = false;
    this.cleatText();
  }

  getData() {
    fetch('http://192.168.8.202:3000/ExpenseRouter/expense')
      .then(response => response.json())
      .then(response => {
        let resp = response.data;
        this.setState({resp});
        console.log(resp);
        this.calTotalxpense();
        this.generateBance();
      })
      .catch(error => console.error(error));
  }

  calTotalxpense() {
    let aaa = 0;
    this.state.resp.map(resp => (aaa = aaa + resp.price));
    console.log('xpesnce Eka  :' + aaa);
    this.setState({expenseval: aaa});
  }

  generateBance() {
    const i = this.state.incomeval;
    const e = this.state.expenseval;
    const t = i - e;
    console.log('Blance is : ' + t);

    this.setState({blance: t});
  }

  render() {
    const {modalVisible} = this.state;

    const tableData = this.state.resp.map(record => [
      record.details,
      record.category,
      record.price,
    ]);

    return (
      <View>
        <TouchableOpacity>
          <Image
            source={require('../assets/icon/logout.png')}
            resizeMode="contain"
            style={style.iconlogOut}
          />
        </TouchableOpacity>
        <View>
          <TouchableOpacity onPress={this.back}>
            <Image
              source={require('../assets/icon/back.png')}
              resizeMode="contain"
              style={style.iconBack}
              onPress={this.createNewAccoutn}
            />
          </TouchableOpacity>
          <Text style={style.topic}>Expense</Text>
        </View>
        <View style={style.section}>
          <TouchableOpacity onPress={this.back}>
            <Image
              source={require('../assets/icon/left.png')}
              resizeMode="contain"
              style={style.iconLeft}
            />
          </TouchableOpacity>

          <Image
            source={require('../assets/icon/calender.png')}
            resizeMode="contain"
            style={style.iconCalender}
          />
          <Text style={style.calenderLbl}>
            {this.state.tempMonth == 8
              ? 'Aug' + ' - ' + this.state.tempYear
              : null}
          </Text>
          <Text style={style.lblRs}>Currently Income : Rs.</Text>
          <Text style={style.lblIncome}>{this.state.incomeval}</Text>

          <TouchableOpacity onPress={this.back}>
            <Image
              source={require('../assets/icon/right.png')}
              resizeMode="contain"
              style={style.iconRight}
            />
          </TouchableOpacity>
        </View>

        <View style={style.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}>
            <View style={style.centeredView}>
              <View style={style.modalView}>
                <Text style={style.modalText}>+ Expense</Text>
                <TouchableOpacity
                  style={[style.button, style.buttonClose]}
                  onPress={() => this.setModalVisible(!modalVisible)}>
                  <Image
                    source={require('../assets/icon/close.png')}
                    resizeMode="contain"
                    style={style.iconclose}
                  />
                </TouchableOpacity>

                <View>
                  <TextInput
                    style={style.details}
                    placeholder="Details"
                    value={this.state.details}
                    onChangeText={value => {
                      this.setState({
                        details: value,
                      });
                    }}
                  />

                  <Picker
                    style={style.categoryDrop}
                    selectedValue={this.state.category}
                    onValueChange={value =>
                      this.setState({
                        category: value,
                      })
                    }>
                    <Picker.Item label="Router Bill" value="Router Bill" />
                    <Picker.Item label="Phone Bill" value="Phone Bill" />
                    <Picker.Item label="Shoping" value="Shoping" />
                    <Picker.Item label="Eating Out" value="Eating Out" />
                    <Picker.Item label="Kids" value="Kids" />
                    <Picker.Item label="Gifts" value="Gifts" />
                    <Picker.Item label="Fuel" value="Fuel" />
                    <Picker.Item label="Other" value="Other" />
                  </Picker>

                  <TextInput
                    style={style.category}
                    editeble={false}
                    showSoftInputOnFocus={false}
                    placeholder="Category"
                    value={this.state.category}
                  />

                  <TextInput
                    style={style.price}
                    placeholder="Price"
                    keyboardType="numeric"
                    value={this.state.price}
                    onChangeText={value => {
                      this.setState({
                        price: value,
                      });
                    }}
                  />

                  <TouchableOpacity
                    onPress={this.saveExpense.bind(this)}
                    style={style.btnSave}>
                    <Text>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        <View style={style.section1}>
          <View style={{height: 350}}>
            <Table>
              <Row
                data={this.state.tableHead}
                style={style.header}
                widthArr={this.state.widthArr}
                textStyle={style.text}
              />
            </Table>
            <ScrollView style={style.dataWrapper}>
              <Table style={{marginTop: 10}}>
                {tableData.map((rowData, index) => (
                  <Row
                    key={index}
                    data={rowData}
                    style={[style.row]}
                    widthArr={this.state.widthArr}
                    style={[
                      style.row,
                      index % 2 && {backgroundColor: '#F7F6E7'},
                    ]}
                    textStyle={style.text}
                  />
                ))}
              </Table>
            </ScrollView>
          </View>

          <TouchableOpacity
            style={style.editebutton}
            onPress={() => this.setModalVisible(true)}>
            <Text>+ Expense</Text>
          </TouchableOpacity>

          <Text style={style.lbltotal}>Total Balance : Rs.</Text>
          <Text style={style.lbltotalVal}>{this.state.blance}</Text>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  topic: {
    top: -15,
    left: 155,
    fontSize: 32,
    color: 'red',
  },
  iconlogOut: {
    left: 370,
    top: 25,
    width: 35,
    height: 35,
    position: 'absolute',
  },
  section: {
    marginTop: 90,
    position: 'absolute',
    left: 13,
    borderRadius: 10,
    width: 400,
    height: 120,
    backgroundColor: 'white',
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  iconBack: {
    left: 20,
    top: 25,
    width: 35,
    height: 35,
  },
  iconLeft: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 40,
  },
  iconRight: {
    width: 40,
    position: 'absolute',
    left: 350,
    top: -110,
  },
  iconCalender: {
    flex: 1,
    left: 130,
    width: 45,
    position: 'relative',
  },
  calenderLbl: {
    fontSize: 22,
    position: 'absolute',
    left: 190,
    top: 45,
  },
  lblRs: {
    fontSize: 18,
    position: 'absolute',
    left: 80,
    top: 90,
    color: '#00b894',
  },
  lblIncome: {
    fontSize: 18,
    position: 'absolute',
    left: 255,
    top: 90,
    color: '#00b894',
  },
  lblSalary: {
    fontSize: 22,
    position: 'absolute',
    left: 10,
    top: 50,
    color: '#10ac84',
    fontFamily: 'sans-serif-medium',
  },
  count: {
    fontSize: 22,
    position: 'absolute',
    right: 10,
    top: 50,
    color: '#10ac84',
  },
  section1: {
    marginTop: 230,
    position: 'absolute',
    left: 13,
    borderRadius: 10,
    width: 400,
    height: 500,
    backgroundColor: 'white',
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  editebutton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    position: 'absolute',
    top: 420,
    marginBottom: 20,
    backgroundColor: 'red',
    width: 280,
    borderRadius: 10,
    left: 75,
  },
  lbltotal: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
    left: 95,
    marginTop: 20,
  },
  lbltotalVal: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
    left: 250,
    top: -23,
  },
  text: {
    textAlign: 'center',
    fontWeight: '100',
  },
  dataWrapper: {
    marginTop: -1,
  },
  row: {
    height: 50,
  },
  header: {
    height: 40,
    backgroundColor: 'red',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    width: 410,
    height: 600,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    padding: 10,
    position: 'absolute',
    top: 20,
    marginBottom: 20,
    left: 350,
  },
  iconclose: {
    width: 20,
    height: 20,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 22,
    color: 'red',
  },
  details: {
    height: 40,
    margin: 12,
    width: 300,
    top: 60,
    borderWidth: 1,
  },
  category: {
    height: 40,
    margin: 12,
    width: 300,
    top: 80,
    borderWidth: 1,
  },
  categoryDrop: {
    height: 40,
    width: 50,
    top: 155,
    left: 270,
    borderWidth: 1,
    borderColor: 'red',
    position: 'absolute',
    zIndex: 4,
  },
  price: {
    height: 40,
    margin: 12,
    width: 300,
    top: 100,
    borderWidth: 1,
  },
  btnSave: {
    height: 40,
    margin: 12,
    width: 200,
    top: 120,
    borderWidth: 1,
    left: 50,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});
