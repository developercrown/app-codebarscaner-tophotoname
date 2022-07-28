import { Dimensions, Image, StatusBar, StyleSheet, View } from "react-native"
import {LogoText} from '../assets/images';
import { FormContainer, GradientButton, IconButton, TextArea } from "../components/FormComponents";
import ScreenView from '../components/ScreenView';
import { useState } from 'react';
import useHeaderbar from "../hooks/useHeaderbar";
import { alignStyles, colors, positionStyles, textStyles } from "../components/Styles";
import useSound from "../hooks/useSound";
import InternalHeader from "../components/InternalHeader";

const ConfigurationView = (props: any) => {
    const { navigation } = props;
    const windowWidth = Dimensions.get('window').width;
    const [server, setServer] = useState('https://api-inventario-minify.upn164.edu.mx/api/v1/');
    const sound = useSound(); 

    const handleStoreServer = () => {
        //TODO: make process to store configuration in local storage
        alert('store ' + server)
    }

    const handleResetConfig = () => {
        //TODO: make process to reset configuration in local storage
        alert('reset app configuration')
    }

    const handleBack = () => {
        sound.back();
        navigation.goBack()
    }

    useHeaderbar({
        hide: true, navigation
    });

    return <>
        <StatusBar barStyle="light-content" backgroundColor='rgba(10, 10, 10, 1)'/>
        <ScreenView style={{backgroundColor: 'rgba(255, 255, 255, .6)', height: '100%'}}>
            <InternalHeader title="Configuración de la app" leftIcon="chevron-back" leftAction={handleBack} rightAction={handleBack} style={{backgroundColor: 'rgba(40, 40, 40, 1)'}}/>

            <View style={[{width: windowWidth}, alignStyles.centered]}>
                <View style={styles.containerTop}>
                    <Image source={LogoText} style={styles.logo} />
                </View>
                <View style={styles.bodyContainer}>
                    <FormContainer>
                        <TextArea fontSize={18} value={server} onChange={setServer} label="URL del servidor"/>
                        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 26 }}>
                            <GradientButton
                                label="Guardar Cambios"
                                labelStyle={[textStyles.md]}
                                onTouch={handleStoreServer}
                            />
                        </View>
                        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 36 }}>
                            <GradientButton
                                label="Restablecer configuraciones"
                                labelStyle={[textStyles.sm]}
                                onTouch={handleResetConfig}
                                width={240}
                                x={0}
                                y={0.2}
                            />
                        </View>
                    </FormContainer>
                </View>
            </View>
            </ScreenView>
        </>
}

const styles = StyleSheet.create({
    containerTop: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    logo: {
        width: 200,
        height: 200,
    },
    bodyContainer: {
        flex: 1
    }
});

export default ConfigurationView;