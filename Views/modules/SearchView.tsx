import { useEffect } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EquipmentInformationView from '../components/EquipmentInformationView';
import ReviewEquipmentView from '../components/ReviewEquipmentView';
import FinderEquipmentView from './../components/FinderEquipmentView';
import UploadPhotoView from '../components/UploadPhotoView';
import RegisterEquipmentView from '../components/RegisterEquipmentView';

const ReviewInventoryView = (props: any) => {
    const { navigation } = props;
    const SearchStack = createNativeStackNavigator();

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    });

    return <SearchStack.Navigator initialRouteName="FinderEquipment">
        <SearchStack.Screen name="FinderEquipment" component={FinderEquipmentView} />
        <SearchStack.Screen name="EquipmentInformation" component={EquipmentInformationView} />
        <SearchStack.Screen name="ReviewEquipment" component={ReviewEquipmentView} />
        <SearchStack.Screen name="RegisterEquipment" component={RegisterEquipmentView} />
        <SearchStack.Screen name="UploadPhoto" component={UploadPhotoView} />
    </SearchStack.Navigator>
}

export default ReviewInventoryView;