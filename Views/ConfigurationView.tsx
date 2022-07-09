import { Image, StyleSheet, View } from "react-native"
import {LogoText} from '../assets/images';
import { FormContainer, GradientButton, TextArea } from "../Components/FormComponents";
import ScreenView from '../Components/ScreenView';
import { useState } from 'react';

const ConfigurationView = (props: any) => {
    const [server, setServer] = useState('https://api-inventario-minify.upn164.edu.mx/api/v1/');

    const handleStoreServer = () => {
        alert('store ' + server)
    }

    const handleResetConfig = () => {
        alert('reset app configuration')
    }

    return <ScreenView style={{backgroundColor: 'rgba(255, 255, 255, .75)'}}>
            <View style={styles.containerTop}>
                <Image source={LogoText} style={styles.logo} />
            </View>
            <View style={styles.bodyContainer}>
                <FormContainer>
                    <TextArea value={server} onChange={setServer} label="URL del servidor"/>
                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 26 }}>
                        <GradientButton label="Guardar Cambios" onTouch={handleStoreServer} />
                    </View>
                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 36 }}>
                        <GradientButton label="Restablecer configuraciones" onTouch={handleResetConfig} width={340} colors={['orange', 'red', 'orange']} x={0} y={0.2}/>
                    </View>
                </FormContainer>
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