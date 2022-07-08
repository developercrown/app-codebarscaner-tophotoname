import { Image, StyleSheet, View } from "react-native"
import {LogoText} from '../assets/images';
import ScreenView from '../Components/ScreenView';

const ConfigurationView = (props: any) => {
    const { navigation } = props;

    return <ScreenView style={{backgroundColor: 'rgba(255, 255, 255, .75)'}}>
            <View style={styles.containerTop}>
                <Image source={LogoText} style={styles.logo} />
            </View>
            <View style={styles.bodyContainer}>

            </View>
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

export default ConfigurationView;