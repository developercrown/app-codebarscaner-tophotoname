import React from 'react';
import { Text, View } from 'react-native';
import { useEffect } from 'react';

const EquipmentInformationView = (props: any) => {
    const {navigation, route} = props;
    const {code} = route.params;

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    });
    return <View>
        <Text>Lol {code}</Text>
    </View>;
}

export default EquipmentInformationView;