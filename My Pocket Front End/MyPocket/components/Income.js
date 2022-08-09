import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Image,
  TouchableOpacity,
  Pressable,
  Modal,
  Alert,
  TextInput,
  Picker,
} from 'react-native';
import {Table, TableWrapper, Row} from 'react-native-table-component';
import {DataTable} from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default class income extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      income: '',
      category: '',
      date: '',
      temp: 'August 2021',
      tempMonth: new Date().getMonth() + 1,
      tempYear: new Date().getFullYear(),

      resp: [],
      tableHead: ['Note', 'Income', 'Date'],
      widthArr: [120, 120, 158],

      tot: '',
    };

    this.getData();
    this.loadData();

    //this.removeTotdata();
    //this.storeData();
    // this.removeValue();
  }

  generateDate = () => {
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    this.setState({
      tempDate: month,
      tempYear: year,
    });
  };

  cleatText() {
    this.setState({
      income: '',
      category: '',
    });
  }

  saveIncome() {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    const today = date + '-' + month + '-' + year;
    console.log(typeof today);
    this.setState({temp: date});
    console.log('today  :' + today);

    fetch('http://192.168.8.202:3000/IncomeRouter/income', {
      method: 'POST',
      body: JSON.stringify({
        income: this.state.income,
        category: this.state.category,
        date: today,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(json => this.getData());

    this.storeData();
    Alert.alert('Income Save..!');
    this.state.modalVisible = false;
    this.cleatText();
  }

  getData() {
    fetch('http://192.168.8.202:3000/IncomeRouter/income')
      .then(response => response.json())
      .then(response => {
        let resp = response.data;
        this.setState({resp});
        this.calTotal();
        this.storeData();
      })
      .catch(error => console.error(error));
  }

  calTotal() {
    let aaa = 0;
    this.state.resp.map(resp => (aaa = aaa + resp.income));
    console.log(aaa);
    this.setState({tot: aaa});
  }

  removeTotdata = async () => {
    await AsyncStorage.removeItem('val');
  };

  removeValue = async () => {
    try {
      await AsyncStorage.removeItem('name');
      await AsyncStorage.removeItem('password');
      console.log('Data Remove');
    } catch (e) {
      console.log('Data Ne');
    }
  };

  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };

  back = () => {
    console.log('Bck');
    this.props.navigation.navigate('Loging');
    this.removeValue();
  };

  storeData = async value => {
    try {
      if (true) {
        const x = await AsyncStorage.removeItem('val');
        //console.log("null unaaa"+x);
        const t = Number(this.state.tot);
        //console.log("Number Tot Eka  :"+t);
        // const v =  await AsyncStorage.setItem('val', "t")
        // console.log("Data Sav45ed"+ v );
      } else {
        const old = Number(await AsyncStorage.getItem('val'));
        const r = Number(this.state.income);
        const i = old + r;
        await AsyncStorage.setItem('val', this.i);
        //console.log( "val is" +i);
      }
    } catch (e) {
      console.log('ASY No Saved');
    }
  };

  loadData = async () => {
    try {
      const val = await AsyncStorage.getItem('val');
      //console.log("get una" + val)
      this.setState({tot: val});
    } catch (e) {
      console.log('Data ne!');
      Massage;
    }
  };

  left = () => {
    console.log('Bck');
  };
  right = () => {
    console.log('Bck');
  };
  render() {
    const {modalVisible} = this.state;

    const tableData = this.state.resp.map(record => [
      record.category,
      record.income,
      record.date,
    ]);

    console.log(this.state.date);
    return (
      <View style={style.main}>
        <View>
          <TouchableOpacity style={style.x}>
            <Image
              source={require('../assets/icon/logout.png')}
              resizeMode="contain"
              style={style.iconlogOut}
              onPress={this.removeValue.bind(this)}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={this.back}>
            <Image
              source={require('../assets/icon/back.png')}
              resizeMode="contain"
              style={style.iconBack}
              onPress={this.createNewAccoutn}
            />
          </TouchableOpacity>
          <Text style={style.topic}>My Income</Text>
        </View>
        <View style={style.section}>
          <TouchableOpacity onPress={this.left}>
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
          <Text style={style.lblRs}>Total is Rs.</Text>
          <Text style={style.lblIncome}>{this.state.tot}</Text>

          <TouchableOpacity onPress={this.right}>
            <Image
              source={require('../assets/icon/right.png')}
              resizeMode="contain"
              style={style.iconRight}
            />
          </TouchableOpacity>
        </View>
        <View style={style.section1}>
          <View style={{height: 400}}>
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

          <View style={style.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}>
              <View style={style.centeredView}>
                <View style={style.modalView}>
                  <Text style={style.modalText}>Add Your Income</Text>
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
                      type="Number"
                      style={style.income}
                      placeholder="Income"
                      keyboardType="numeric"
                      value={this.state.income}
                      onChangeText={value => {
                        this.setState({
                          income: value,
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
                      <Picker.Item label="Salary" value="Salary" />
                      <Picker.Item label="Gift" value="Gift" />
                      <Picker.Item label="Loan" value="Loan" />
                      <Picker.Item label="Other" value="Other" />
                    </Picker>

                    <TextInput
                      style={style.category}
                      editeble={false}
                      showSoftInputOnFocus={false}
                      placeholder="Category"
                      value={this.state.category}
                      // onChangeText={(value)=>{
                      // this.setState({
                      // category : value
                      // })
                      //}}
                    />

                    {/* <TextInput
                        style={style.category}
                        
                        placeholder="Category"
                        value={this.state.category}
                            onChangeText={(value)=>{
                            this.setState({
                            category : value
                            })
                        }}
                   /> */}
                    {/* <TextInput
                        style={style.date}
                        placeholder="Date"
                        value={this.state.date}
                            onChangeText={(value)=>{
                            this.setState({
                            date : value
                            })
                        }}
                   /> */}

                    <TouchableOpacity
                      onPress={this.saveIncome.bind(this)}
                      style={style.btnSave}>
                      <Text>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>

          <TouchableOpacity
            style={style.editebutton}
            onPress={() => this.setModalVisible(true)}>
            <Text>+ Income</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  topic: {
    top: -40,
    left: 137,
    fontSize: 32,
    color: '#00b894',
  },
  iconlogOut: {
    left: 370,
    top: 36,
    width: 35,
    height: 35,
    position: 'relative',
  },

  section: {
    flexDirection: 'row',
    left: 13,
    margin: 'auto',
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
    position: 'relative',
    left: 20,

    width: 35,
    height: 35,
  },
  iconLeft: {
    position: 'relative',
    left: 20,
    top: 40,
    width: 35,
    height: 35,
  },
  iconRight: {
    position: 'relative',
    right: 20,
    top: 40,
    width: 35,
    height: 35,
  },
  iconCalender: {
    flex: 1,
    width: 40,
    height: 40,
    marginTop: 25,
    marginRight: 90,
  },
  calenderLbl: {
    fontSize: 22,
    marginTop: 32,
    left: 185,
    position: 'absolute',
  },
  lblRs: {
    fontSize: 22,
    position: 'absolute',
    left: 110,
    top: 80,
    color: '#00b894',
  },
  lblIncome: {
    fontSize: 20,
    position: 'absolute',
    left: 220,
    top: 82,
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
    marginTop: 250,
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
    backgroundColor: '#00b894',
    width: 280,
    borderRadius: 10,
    left: 75,
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
    color: '#00b894',
  },
  income: {
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
    top: 70,
    borderWidth: 1,
  },
  categoryDrop: {
    height: 40,
    width: 50,
    top: 145,
    left: 270,
    borderWidth: 1,
    borderColor: 'red',
    position: 'absolute',
    zIndex: 4,
  },
  date: {
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
    backgroundColor: '#00b894',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
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
    backgroundColor: '#00b894',
  },
});
