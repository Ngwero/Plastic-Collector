import React from 'react';
import { View, Text, Alert, Dimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import { useDispatch, useSelector } from 'react-redux';
import { BottomSheet, CollectionPreview, DesignIcon } from '../../Components';
import Ionicon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import CollectionDetails from '../../Components/CollectionDetails';

const { height } = Dimensions.get('window');
const Filter = ({ navigation }) => {
  const [ state, setState ] = React.useState({ district: 'kampala', nextPage: 1, limit: 100, isVisible: false });
  const { districtCollections, collections, activeCollection } = useSelector((state) => state.Collections);
  const { user } = useSelector((state) => state.Account);
  const dispatch = useDispatch();

  React.useEffect(
    () => {
      const sub = navigation.addListener('focus', () => getDistrictCollections());
      return () => sub;
    },
    [ navigation ]
  );

  // Get all collection , this is to be used by default but it' not a must
  const getCollections = () => {
    const { nextPage: page, limit } = state;
    dispatch.Collections.getAllCollections({
      page,
      limit,
      callback: (res) => {
        if (!res.success) return alert(res.result);
        const { nextPage, totalDocuments: total, ...rest } = res;
        setState({ ...state, nextPage, total });
      }
    });
  };

  // get collections by district
  const getDistrictCollections = () => {
    const { nextPage: page, limit, district } = state;
    dispatch.Collections.getDistrictCollections({
      page,
      limit,
      district: user.district,
      callback: ({ result, success }) => {
        if (!success) return Alert.alert('Something went wrong', result);

        const { nextPage, totalDocuments: total, ...rest } = result;
        setState({ ...state, nextPage, total });
      }
    });
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: RFValue(10) }}>
      <BottomSheet isVisible={state.isVisible} closeModal={() => setState({ ...state, isVisible: false })}>
        <View style={{ maxHeight: 0.9 * height }}>
          <CollectionDetails {...activeCollection} />
        </View>
      </BottomSheet>
      <Text style={{ fontFamily: 'OpenSans-Regular', fontSize: RFValue(14), marginVertical: RFValue(10) }}>
        These are all the collections in {user.district} district
      </Text>
      <FlatList
        style={{ flexGrow: 1 }}
        data={districtCollections}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <CollectionPreview
            {...item}
            onPress={() => {
              dispatch.Collections.setActiveCollection(item);
              setState({ ...state, isVisible: true });
            }}
          />
        )}
      />
    </View>
  );
};

export default Filter;
