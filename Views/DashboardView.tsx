import { Image, StyleSheet, Text, View } from "react-native"
import {LogoText} from '../assets/images';
import ScreenView from '../Components/ScreenView';
import useHeaderbar from "../hooks/useHeaderbar";

const DashboardView = (props: any) => {
    const {navigation} = props;
    useHeaderbar({
        navigation,
        hideShadow: false,
        leftSection: null,
        rightSection: null
    })
    return <ScreenView style={{backgroundColor: 'rgba(255, 255, 255, .75)'}}>
            
        </ScreenView>
}

const styles = StyleSheet.create({
    containerTop: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    logo: {
        width: 300,
        height: 300,
    },
    bodyContainer: {
        flex: 1
    }
});

export default DashboardView;