import React, { useState } from 'react';
import {
   StyleSheet,
   Text,
   View,
   Button,
   YellowBox,
   AsyncStorage,
   TouchableOpacity,
   TextInput,
   KeyboardAvoidingView,
   Image,
   Platform,
   ActivityIndicator,
} from 'react-native';
import PhoneInput from 'react-native-phone-input';
import Toast from 'react-native-simple-toast';
import styles from './styles/register';

export default RiderRegister = () => {
   const [firstname, setFirstname] = useState('');
   const [lastname, setLastname] = useState('');
   const [password, setPassword] = useState('');
   const [email, setEmail] = useState('');
   const [color, setColor] = useState('');

   const navigationOptions = {
      headerStyle: {
         backgroundColor: '#42A5F5',
      },
      headerTitleStyle: {
         color: '#fff',
      },
      headerBackTitleStyle: {
         color: '#fff',
      },
      headerTintColor: '#fff',
      title: 'Register For Riding',
   };

   return (
      <KeyboardAvoidingView behavior="padding" style={styles.wrapper}>
         <View style={styles.container}>
            <View style={styles.socialMedia}>
               <TouchableOpacity
                  style={styles.googlePlusButton}
                  onPress={() => alert('this is google+')}
               >
                  <Image
                     source={require('../../assets/Images/googleplus.png')}
                     style={{
                        width: 20,
                        height: 20,
                     }}
                  />
               </TouchableOpacity>
               <TouchableOpacity
                  style={styles.facebookButton}
                  onPress={() => alert('this is facebook')}
               >
                  <Image
                     source={require('../../assets/Images/facebook.png')}
                     style={{
                        width: 20,
                        height: 20,
                     }}
                  />
               </TouchableOpacity>
            </View>
            <View style={styles.RideNames}>
               <TextInput
                  style={styles.textInputfn}
                  placeholder="First Name"
                  maxLength={30}
                  onChangeText={firstname =>
                     this.setState({
                        firstname,
                     })
                  }
                  underlineColorAndroid="#c0c0c0"
               />

               <TextInput
                  style={styles.textInputln}
                  placeholder="Last Name"
                  maxLength={30}
                  onChangeText={lastname =>
                     this.setState({
                        lastname,
                     })
                  }
                  underlineColorAndroid="#c0c0c0"
               />
            </View>
            <TextInput
               style={styles.textInputEmail}
               placeholder="Email"
               maxLength={40}
               onChangeText={email => this.setState({ email })}
               underlineColorAndroid="#c0c0c0"
            />
            <View style={{ flexDirection: 'row' }}>
               <View
                  style={{
                     marginTop: 15,
                     marginLeft: 10,
                  }}
               >
                  <PhoneInput ref="phone" />
               </View>
               <TextInput
                  style={styles.textInputMobile}
                  placeholder="Mobile"
                  keyboardType="numeric"
                  maxLength={10}
                  onChangeText={mobile =>
                     this.setState({
                        mobile,
                     })
                  }
                  underlineColorAndroid="#c0c0c0"
               />
            </View>
            <TextInput
               style={styles.textInputEmail}
               placeholder="Password"
               maxLength={50}
               onChangeText={password =>
                  this.setState({
                     password,
                  })
               }
               underlineColorAndroid="#c0c0c0"
               secureTextEntry={true}
            />

            <TouchableOpacity
               style={styles.NextButton}
               onPress={this._VerifyAsync}
            >
               <Text
                  style={{
                     color: '#ffffff',
                     fontWeight: 'bold',
                  }}
               >
                  NEXT
               </Text>
            </TouchableOpacity>
            <ActivityIndicator size="large" color={color} />
         </View>
      </KeyboardAvoidingView>
   );
};

_VerifyAsync = async (props, firstname, email, mobile, lastname, password) => {
   let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
   if (
      firstname.trim() === '' ||
      email.trim() === '' ||
      mobile.trim() === '' ||
      lastname.trim() === '' ||
      password.length == ''
   ) {
      Toast.show(
         'All inputs must be filled!',
         Toast.SHORT,
         Toast.TOP,
         ToastStyle,
      );
      return;
   }
   if (reg.test(this.state.email) === false) {
      Toast.show('INVALID EMAIL!', Toast.SHORT, Toast.TOP, ToastStyle);
      return;
   }

   this.setState({ color: '#42A5F5' });

   firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(
         authData => {
            //create a rider node with:firstname,lastname,phone,profile

            if (firebase.auth().currentUser) {
               userId = firebase.auth().currentUser.uid;
               if (userId) {
                  AsyncStorage.setItem('riderId', userId);
                  firebase
                     .database()
                     .ref(`Riders/${userId}/Details`)
                     .set({
                        firstname: this.state.firstname,
                        lastname: this.state.lastname,
                        email: this.state.email,
                        phone: this.state.mobile,
                        profile_image: 'default',
                     })
                     .then(
                        () => {
                           Toast.show('rider added successfully', Toast.SHORT);
                           this.setState({
                              color: '#ffffff',
                           });
                           props.navigation.navigate('App1');
                        },
                        error => {
                           Toast.show(error.message, Toast.SHORT);
                           this.setState({
                              color: '#ffffff',
                           });
                        },
                     );
               }
            }

            //this.props.navigation.navigate('App1');
         },
         error => {
            Toast.show('error:' + error.message, Toast.SHORT, Toast.TOP);
            this.setState({ color: '#ffffff' });
         },
      );
};

const sendSMSVerification = (res, uid, phone) => {
   const code = Math.floor(Math.random() * 899999 + 100000);
   const expiration = Date.now() + 2 * 60000;
   const verification = { code, expiration, valid: true };

   twilio.messages
      .create({
         body: `Your code is ${code}`,
         to: twilioConfig.phone_dev ? twilioConfig.phone_dev : phone,
         from: twilioConfig.phone_from,
      })
      .then(message => {
         firebase
            .database()
            .ref(`/users/${uid}/verification`)
            .set(verification)
            .then(() => {
               return res.send({ success: true });
            })
            .catch(err => {
               return res.status(422).send(err);
            });
      })
      .catch(err => {
         return res.status(422).send(err);
      });
};
const ToastStyle = {
   backgroundColor: '#4ADDFB',
   width: 300,
   height: Platform.OS === 'ios' ? 50 : 100,
   color: '#ffffff',
   fontSize: 15,
   lineHeight: 2,
   lines: 4,
   borderRadius: 15,
   fontWeight: 'bold',
   yOffset: 40,
};
