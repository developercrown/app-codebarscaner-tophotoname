import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';

import HomeView from './modules/HomeView';
import ReviewInventoryView from './modules/ReviewInventoryView';

import useSound from '../hooks/useSound';


const DashboardView = (props: any) => {
    const {navigation} = props;
    const [welcomeState, setWelcomeState] = useState(false);
    const sound = useSound(); 

    const DashboardStack = createNativeStackNavigator();

    useEffect(() => {
        if(!welcomeState){
            sound.start();
            setWelcomeState(true)
        }
    }, [welcomeState]);

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    });
    
    return <DashboardStack.Navigator initialRouteName="Home">
        <DashboardStack.Screen name="Home" component={HomeView} />
        <DashboardStack.Screen name="ReviewInventory" component={ReviewInventoryView} />
    </DashboardStack.Navigator>
}
export default DashboardView;