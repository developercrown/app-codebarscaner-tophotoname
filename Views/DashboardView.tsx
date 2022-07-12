import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import HomeView from './Pages/HomeView';
import ReviewInventory from './Pages/ReviewInventory';

const DashboardView = (props: any) => {
    const {navigation} = props;
    const DashboardStack = createNativeStackNavigator();

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    });

    return <DashboardStack.Navigator initialRouteName="Home">
        <DashboardStack.Screen name="Home" component={HomeView} />
        <DashboardStack.Screen name="ReviewInventory" component={ReviewInventory} />
    </DashboardStack.Navigator>
}
export default DashboardView;