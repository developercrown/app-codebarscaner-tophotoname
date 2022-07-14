import { useEffect } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CodeReaderView from "../components/CodeReaderView";
import EquipmentInformationView from '../components/EquipmentInformationView';

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
    </ReviewInventoryStack.Navigator>
}

export default ReviewInventoryView;