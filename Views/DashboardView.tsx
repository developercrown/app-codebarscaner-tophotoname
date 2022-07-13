import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import useSound from '../hooks/useSound';
import HomeView from './Pages/HomeView';
import ReviewInventory from './Pages/ReviewInventory';

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
        <DashboardStack.Screen name="ReviewInventory" component={ReviewInventory} />
    </DashboardStack.Navigator>
}
export default DashboardView;