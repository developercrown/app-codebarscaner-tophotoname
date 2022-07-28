import { Image, StatusBar, StyleSheet, Text, View } from "react-native"
import { alignStyles, colors, textStyles } from "../../components/Styles";
import { GradientContainer } from "../../components/FormComponents";
import Ionicons from '@expo/vector-icons/Ionicons';
import { LogoText } from "../../assets/images";
import useHeaderbar from "../../hooks/useHeaderbar";
import { IconButton } from "../../components/FormComponents";
import ScreenView from '../../components/ScreenView';
import Navigator from "../../components/Navigator";
import { useEffect } from "react";

const HomeView = (props: any) => {
    const {navigation} = props;
    
    const handleLogout = () => {
        alert('logout action')
    }

    useHeaderbar({
        navigation,
        hideShadow: false,
        leftSection: <View style={[{justifyContent: 'center', alignItems: 'center', height: 40}]}>
            <Text style={[textStyles.bold, textStyles.md, colors.white, {}]}>Bienvenido</Text>
        </View>,
        rightSection: <View style={[{justifyContent: 'flex-start', alignItems: 'flex-start', height: 60}]}>
            <IconButton icon="exit" color={colors.white.color} size={26}  style={{marginTop: 10}} onTouch={handleLogout} />
        </View>,
        style: {
            backgroundColor: 'rgba(0, 0, 0, .5)',
        }
    });
    
    return <View style={{flex: 1}}>
        <StatusBar barStyle="light-content" backgroundColor='rgba(10, 10, 10, 1)'/>
        <ScreenView style={{backgroundColor: 'transparent'}} styleContainer={{paddingVertical: 0}}>

            {/* <View style={{marginTop: 20}}>
                <View style={[alignStyles.centered]}>
                    <Ionicons name="person-circle" size={66} style={[colors.white, {marginLeft: 4, opacity: .9, elevation: 2}]} />
                </View>
                <Text style={[colors.white, textStyles.bold, textStyles.lg, textStyles.alignCenter]}>Usuario</Text>
            </View> */}
            <View style={styles.containerTop}>
                <View style={[styles.logoContainer]}>
                    <Image source={LogoText} style={styles.logo} />
                </View>
            </View>
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
    logoContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.65)',
        borderRadius: 200,
        padding: 20,
        width: 300,
        height: 300,        
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 240,
        height: 240,
    },
    bodyContainer: {
        flex: 1
    }
});

export default HomeView