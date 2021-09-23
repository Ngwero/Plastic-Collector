import React from 'react';
import { View, Text, Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input } from '../../Components';

const CheckCode = ({ code, setCode, setReg }) => {
  const loading = useSelector((state) => state.loading.effects.Account);
  // const [state, setState] = useState(initialState)
  const dispatch = useDispatch();

  const verifyCode = () => {
    dispatch.Account.verifyCode({
      code,
      callback: ({ success, result }) => {
        console.log('Result from verifying', result);
        if (!success) return Alert.alert('Something went wrong', result);
        else setReg();
      }
    });
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: RFValue(10) }}>
      <Text style={{ fontFamily: 'OpenSans-Regular', fontSize: RFValue(14), marginBottom: RFValue(10) }}>
        Enter the verification code that was given to you. The four digit code will give you access to the platform
      </Text>
      <Input
        value={code}
        onChangeText={(code) => setCode(code)}
        placeholder="Enter the verification code"
        maxLength={4}
      />
      <Button title="Verify Registration" onPress={verifyCode} loading={loading.verifyCode} />
    </View>
  );
};

export default CheckCode;