import { StyleSheet, Text, View } from "react-native"
import ScreenView from '../../../Components/ScreenView';
import Navigator from "../../../Components/Navigator";
import { useEffect } from "react";
import CaptureCodebarView from "./Components/CaptureCodebarView";

const ReviewInventoryView = (props: any) => {
    const {navigation} = props;

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    })
    
    return <View style={{flex: 1}}>
        <ScreenView style={{backgroundColor: 'rgba(255, 255, 255, 0.2)'}} styleContainer={{paddingVertical: 0}}>
            <CaptureCodebarView />
        </ScreenView>
        <Navigator navigation={navigation}/>
    </View>
}

const styles = StyleSheet.create({
    containerTop: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        padding: 20
    },
    logo: {
        width: 200,
        height: 200,
        marginTop: 40,
    },
    bodyContainer: {
        flex: 1
    }
});

export default ReviewInventoryView