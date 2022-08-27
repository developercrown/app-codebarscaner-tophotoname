import { useEffect } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UsersSearchView from '../components/UsersSearchView';

const UsersView = (props: any) => {
    const { navigation } = props;
    const SearchStack = createNativeStackNavigator();

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    });

    return <SearchStack.Navigator initialRouteName="UsersSearch">
        <SearchStack.Screen name="UsersSearch" component={UsersSearchView} />
    </SearchStack.Navigator>
}

export default UsersView;