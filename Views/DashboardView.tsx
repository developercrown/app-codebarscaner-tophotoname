import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext, useEffect, useState } from 'react';

import HomeView from './modules/HomeView';
import ReviewInventoryView from './modules/ReviewInventoryView';

import useSound from '../hooks/useSound';
import AuthContext from '../context/AuthProvider';


const DashboardView = (props: any) => {
    const {navigation} = props;
    const [welcomeState, setWelcomeState] = useState(false);
    const sound = useSound();
    const DashboardStack = createNativeStackNavigator();
    // const { auth, setAuth } : any = useContext(AuthContext);
    
    useEffect(() => {
        if(!welcomeState){
            sound.start();
            setWelcomeState(true)
            // console.log('auth data', auth); //TODO: delete in production
            
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