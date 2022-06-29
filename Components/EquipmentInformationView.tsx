import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { BlurView } from 'expo-blur';

const InfoRow = (props: any) => {
    const {value, label} = props
    const {textSm, textWhite, textBold} = GlobalStyles

    return <View style={{flex: 1, flexDirection: 'row'}}>
        <Text style={[textSm, textWhite, textBold]}>{label}: </Text>
        <Text style={[textSm, textWhite]}>{value}</Text>
    </View>
}

const EquipmentInformationView = (props: any) => {
    const { codebar, gotoInit } = props;
    const [wait, setWait] = useState<boolean>(false);

    useEffect(() => {
        console.log('lol');
        
    });

    return <View style={containerStyles.container}>
        <BlurView intensity={10} style={headerStyles.container} tint="light">
            <Text style={headerStyles.title}>Información del equipo</Text>
        </BlurView>
        <BlurView intensity={10} style={BodyStyles.container} tint="light">
            <View style={BodyStyles.informationContainer}>
                <InfoRow label="Código" value={codebar}/>
            </View>
        </BlurView>
        <View style={controlsStyles.container}>
            <View style={controlsStyles.containerControls}>
                
            </View>
        </View>
    </View>
}

const GlobalStyles = StyleSheet.create({
    textSm: {
        fontSize: 16
    },
    textMd: {
        fontSize: 20
    },
    textWhite: {
        color: 'white'
    },
    textBold: {
        fontWeight: 'bold'
    },
});

const containerStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
});

const headerStyles = StyleSheet.create({
    container: {
        flex: 1,
        height: 100,
        backgroundColor: 'rgba(187, 50, 203, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'rgba(71, 21, 159, .6)',
        borderLeftWidth: 1,
        borderRightWidth: 1
    },
    title: {
        color: '#eee',
        fontSize: 20,
        fontWeight: 'normal'
    }
});

const BodyStyles = StyleSheet.create({
    container: {
        flex: 6,
        backgroundColor: 'rgba(59, 0, 153, 0.2)',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        borderColor: 'rgba(71, 21, 159, .6)',
        borderBottomColor: 'rgba(106, 50, 203, .6)',
        borderBottomWidth: 2,
        borderLeftWidth: 1,
        borderRightWidth: 1
    },
    informationContainer: {
        height: '100%',
        width: '100%',
        paddingBottom: 32
    },
    legendContainer: {
        width: '93%',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        height: '10%',
        bottom: 40
    },
    legend: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold'
    }
});

const controlsStyles = StyleSheet.create({
    container: {
        flex: 3,
        backgroundColor: 'rgba(0, 0, 0, .4)'
    },
    containerCodebarInput: {

    },
    codebarInput: {
        fontSize: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        color: 'white',
        height: 60,
        margin: 14,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#303042',
        shadowColor: 'black',
        padding: 10,
        textAlign: 'center'
    },
    containerControls: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 10
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        height: 48,
        padding: 0,
        margin: 8
    },
    buttonCycled: {
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        borderRadius: 100,
        width: 48,
        height: 48,
        padding: 0,
        margin: 8
    },
    buttonDark: {
        backgroundColor: 'rgba(17, 18, 25, 1)',
    },
    buttonDarkDisabled: {
        backgroundColor: 'rgba(17, 18, 25, .4)',
    },
    buttonDanger: {
        backgroundColor: 'rgba(143, 4, 1, 1)',
    },
    buttonDangerDisabled: {
        backgroundColor: 'rgba(143, 4, 1, .4)',
    },
    buttonPrimary: {
        backgroundColor: 'rgba(232, 0, 139, 1)'
    },
    buttonPrimaryDisabled: {
        backgroundColor: 'rgba(232, 0, 139, .2)'
    },
    buttonSecondary: {
        backgroundColor: 'rgba(56, 168, 197, 1)'
    },
    buttonSecondaryDisabled: {
        backgroundColor: 'rgba(46, 93, 105, .5)'
    },
    buttonSecondaryActive: {
        backgroundColor: 'rgba(73, 185, 214, 1)'
    },
    buttonIconWhite: {
        color: 'rgba(255, 255, 255, 1)'
    },
    buttonIconWhiteMutted: {
        color: 'rgba(255, 255, 255, .4)'
    },
    textButtonWhite: {
        color: '#eee'
    },
    textButtonMutted: {
        color: 'rgba(255, 255, 255, .5)'
    }
});



export default EquipmentInformationView;