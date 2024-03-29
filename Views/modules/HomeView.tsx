import { Alert, Dimensions, Image, StatusBar, StyleSheet, Text, View } from "react-native"
import { colors, textStyles } from "../../components/Styles";
import { LogoText } from "../../assets/images";
import useHeaderbar from "../../hooks/useHeaderbar";
import { IconButton } from "../../components/FormComponents";
import ScreenView from '../../components/ScreenView';
import Navigator from "../../components/Navigator";
import useSound from "../../hooks/useSound";
import { useContext } from "react";
import AuthContext from "../../context/AuthProvider";
import useLocalStorage from "../../hooks/useLocalStorage";
import Constants from 'expo-constants'

const HomeView = (props: any) => {
    const {navigation} = props;
    const { auth, setAuth } : any = useContext(AuthContext);
    const windowHeight = Dimensions.get('window').height;
    const { remove } = useLocalStorage();

    const sound = useSound();
    const handleLogout = () => {
        sound.notification()
        Alert.alert('Confirmación!', '¿Realmente quieres cerrar tu sessón?', [
            {
                text: 'Cerrar Sessión', onPress: () => {
                    sound.touch()
                    remove('token').then(result => {
                        setAuth(null);
                        navigation.replace('Login')
                    });
                },
            },
            {
                text: 'Cancelar', onPress: () => {
                    sound.touch()
                },
            }
        ]);
    }

    useHeaderbar({
        navigation,
        hideShadow: false,
        leftSection: <View style={[{justifyContent: 'center', alignItems: 'center', height: 40}]}>
            {
                auth?.data?.username && <Text style={[textStyles.bold, textStyles.md, colors.white, {}]}>Bienvenido {auth?.data?.username}</Text>
            }
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
            <View style={[styles.containerTop, { height: windowHeight-Constants.statusBarHeight-100 }]}>
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
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // marginTop: 20,
        // padding: 20,
        // backgroundColor: "red"
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