import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, FlatList, Picker, TextInput } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import { Rating, Button, Slider } from 'react-native-elements';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { CheckBox } from 'react-native-check-box';
//import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import axios from 'axios';



export default class Test extends Component {

  constructor(props){
    super(props);
    this.state = {
      initialRate: null,
      rating: null,
      age: null,
      size: null,
      location: {coords: {lattitude: 'empty', logitude: 'empty'}},
      locationError: null,
      image: null,
      comment: null,
      recentTurds: null,
      turdServer: 'http://82.31.145.132:8095',
    };
    this.setRating = this.setRating.bind(this);
    this.setAge = this.setAge.bind(this);
    this.setSize = this.setSize.bind(this);
    //this.setAge = this.setAge.bind(this);
    //this.props.endpoint = 'http://82.31.145.132:8095'


  }

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        locationError: 'Failed: Android emulator.'
      });
    } else {
      this.setState({
        locationError: 'Passed: Android emulator.'
      });
    }
  }

  componentDidMount(){
    axios.get(this.state.turdServer + '/questions')
      .then((response) => {
        this.setState({ageOptions: response.data[0].options});
        this.setState({sizeOptions: response.data[1].options});
        //console.log('q state:  data', response.data[0].options);
      })
      .catch(function (error) {
        console.log('get turds err', error);
      });



    axios.get(this.state.turdServer +'/turds')
      .then((response) => {
        console.log('getTurs response',response.data);
        this.setState({recentTurds: response.data});
      })
      .catch(function (error) {
        console.log('get turds err', error);
      });
 }



  setAge(value){
    this.setState({age: value})
  }

  setRating(value) {
    this.setState({rating: value})
  }

  setSize(value) {
    this.setState({size: value})
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({locationError: 'Permission to access location was denied'});
    } else {
      let location = await Location.getCurrentPositionAsync({});
      this.setState({ location: location });
    }
  };



  saveTurd() {
    const turd = {
      age: this.state.age,
      size: this.state.size,
      rating: this.state.rating,
      location: this.state.location,
      image: this.state.image,
      comment: this.state.comment,
    };

    axios.post(this.state.turdServer + '/turd/save', turd)
    .then((response) => {
      console.log('turdSaveResponse', response.data);
      this.setState({recentTurds: response.data})
      console.log('response',response.data);
    })
    .catch(function (error) {
      console.log('error', error);
    });
  }


    render() {
    return (
      <View style={styles.container}>
        <RadioForm
        radio_props={this.state.ageOptions}
        initial={null}
        onPress={(value) => this.setAge(value)}
        animation={true}
        labelStyle={{marginRight: 20}}
        style={{flexDirection: 'row'}}
        />

        <RadioForm
        radio_props={this.state.sizeOptions}
        initial={null}
        onPress={(value) => this.setSize(value)}
        animation={true}
        labelStyle={{marginRight: 20}}
        style={{flexDirection: 'row'}}
        />

        <Rating
          startingValue={this.state.initialRate}
          fractions={1}
          ratingCount={5}
          onFinishRating={this.setRating}
          style={{ paddingVertical: 10 }}
        />
        <TextInput
          style={{height: 40}}
          placeholder="Type here to translate!"
          onChangeText={(text) => this.setState({comment:text})}
        />
        <Button
          onPress={() => this._getLocationAsync()}
          title="Get location"
          style="{{marginBottom: 50}}"
        />
        <Text>-- spacer --</Text>
        <Button
          onPress={() => this.saveTurd()}
          title="Save Turd"
        />
        <Text>-- spacer --</Text>



        <Text>Rating: {this.state.rating}</Text>
        <Text>Age: {this.state.age}</Text>
        <Text>Size: {this.state.size}</Text>
        <Text>Latitude: {this.state.location.coords.latitude}</Text>
        <Text>Longitude: {this.state.location.coords.longitude}</Text>
        <Text>LocationError: {this.state.locationError}</Text>
        <Text>Message: {this.state.comment}</Text>
        <Text>-- spacer --</Text>

        <FlatList
          data={this.state.recentTurds}
          renderItem={({item}) => <Text>Age: {item.age} </Text>}
        />
      </View>
  );
}}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  paddingTop: 50
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  }
});
