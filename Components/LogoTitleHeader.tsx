import { Image, StyleSheet, View } from "react-native"
import {AppName, Logo, LogoText} from '../assets/images';
import Constants from 'expo-constants'

const headerStyles = StyleSheet.create({
    header: {
        paddingVertical: 4,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    appName: {
        width: 200,
        height: 40,
        marginLeft: 6
    },
    headerLogo: {
        width: 45,
        height: 30,
    }
});

const LogoTitle = (props: any) => {
    return <View style={[headerStyles.header, { marginTop: Constants.statusBarHeight }]}>
        <Image source={Logo} style={headerStyles.headerLogo} />
        <Image source={AppName} style={headerStyles.appName} />
    </View>
}

export default LogoTitle;