import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext, useEffect, useState } from 'react';

import HomeView from './modules/HomeView';
import ReviewInventoryView from './modules/ReviewInventoryView';

import useSound from '../hooks/useSound';
import UploadPhotoView from './components/UploadPhotoView';
import useLocalStorage from '../hooks/useLocalStorage';
import ConfigContext from '../context/ConfigProvider';


const DashboardView = (props: any) => {
    const {navigation} = props;
    const [welcomeState, setWelcomeState] = useState(false);
    const sound = useSound(); 
    const { get } = useLocalStorage();
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
        <DashboardStack.Screen name="UploadPhoto" component={UploadPhotoView} />
    </DashboardStack.Navigator>
}
export default DashboardView;