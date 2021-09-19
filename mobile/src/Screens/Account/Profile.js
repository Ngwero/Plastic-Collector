import React from 'react';
import { View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { DesignIcon } from '../../Components';
import { removeAsyncStorage } from '../../Utils/Functions';

const Profile = () => {
  const { user, statistics } = useSelector((state) => state.Account);
  const [ loader, setLoader ] = React.useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const totalPackages =
    statistics.collections && statistics.collections.reduce((p, c) => p + parseInt(c.totalCollection), 0);
  const totalWeight = statistics.collections && statistics.collections.reduce((p, c) => p + parseInt(c.totalweight), 0);

  const logout = async () => {
    setLoader(true);
    await removeAsyncStorage('user', (res) => {
      setLoader(false);
      if (!res.success) return Alert.alert('Something went wrong', res.result);
      dispatch.Account.setUser({});
      dispatch.Account.setStatistics({ collections: [], droppers: [] });
      dispatch.Collections.setDistrictColletions([]);
      navigation.navigate('Login');
    });
  };

  // React.useEffect(() => {}, [ statistics ]);

  return (
    <View style={{ flex: 1, backgroundColor: '#eeeeee70', width: '100%' }}>
      <View
        style={{
          alignSelf: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
          width: '100%',
          paddingVertical: RFValue(15)
        }}
      >
        <Pressable
          style={{
            width: RFValue(100),
            height: RFValue(100),
            borderRadius: 100,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#eee'
          }}
        >
          <DesignIcon name="user" size={50} color="#aaa" />
        </Pressable>
        <Text style={{ fontFamily: 'OpenSans-Bold', fontSize: RFValue(18), marginTop: RFValue(10) }}>{user.name}</Text>
        <Text style={{ fontFamily: 'OpenSans-Regular', fontSize: RFValue(16), color: '#000' }}>{user.phoneNumber}</Text>
      </View>

      <Pressable
        onPress={logout}
        style={{
          marginVertical: RFValue(10),
          flexDirection: 'row',
          paddingHorizontal: RFValue(10),
          height: RFValue(60),
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <DesignIcon name="lock" size={28} />
          <Text style={{ fontFamily: 'OpenSans-Regular', fontSize: RFValue(16), marginLeft: RFValue(10) }}>
            Logout of your account
          </Text>
        </View>
        {loader ? <ActivityIndicator size={25} /> : <DesignIcon name="chevron-right" pkg="mc" size={28} color="#aaa" />}
      </Pressable>

      <View
        style={{
          // paddingHorizontal: RFValue(10),
          // marginVertical: RFValue(10),
          // backgroundColor: '#fff',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {[
          { title: 'Total Collections', stat: statistics.collections && statistics.collections.length },
          { title: 'Total Droppers', stat: statistics.droppers && statistics.droppers.length },
          { title: 'Total Packages', stat: totalPackages },
          { title: 'Total Weight', stat: totalWeight }
        ].map(({ title, stat }, index) => (
          <View
            key={index}
            style={{
              width: '49%',
              alignItems: 'center',
              backgroundColor: '#fff',
              marginBottom: RFValue(10),
              borderLeftWidth: index % 2 === 1 ? RFValue(5) : 0,
              // borderRightWidth: index === 0 ? RFValue(5) : 0,
              borderColor: '#eeeeee70',
              paddingVertical: RFValue(15)
            }}
          >
            <Text style={{ fontFamily: 'OpenSans-Regular', fontSize: RFValue(16), color: '#aaa' }}>{title}</Text>
            <Text style={{ fontFamily: 'OpenSans-Bold', fontSize: RFValue(30) }}>{stat}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Profile;