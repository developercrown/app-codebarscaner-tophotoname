import { useEffect } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CodeReaderView from "../components/CodeReaderView";
import EquipmentInformationView from '../components/EquipmentInformationView';
import RegisterEquipmentView from '../components/RegisterEquipmentView';

const ReviewInventoryView = (props: any) => {
    const {navigation} = props;
    const ReviewInventoryStack = createNativeStackNavigator();

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    });

    return <ReviewInventoryStack.Navigator initialRouteName="CodebarReader">
        <ReviewInventoryStack.Screen name="CodebarReader" component={CodeReaderView} />
        <ReviewInventoryStack.Screen name="EquipmentInformation" component={EquipmentInformationView} />
        <ReviewInventoryStack.Screen name="RegisterEquipment" component={RegisterEquipmentView} />
    </ReviewInventoryStack.Navigator>
}

export default ReviewInventoryView;