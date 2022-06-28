import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Audio } from 'expo-av';

const CaptureCodebarView = (props: any) => {
    const [view, setView] = useState<number>(1);
    const [sound, setSound] = useState<any>();
    const [scannedCode, setScannedCode] = useState<string | undefined>('');
    const [hasPermission, setHasPermission] = useState<any>(null);
    const [scanned, setScanned] = useState<any>(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const handleBarCodeScanned = async (props: any) => {
        let { type, data } = props
        setScanned(true);
        setScannedCode(data);

        (async () => {
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/audio/short.mp3')
            );
            setSound(sound);
            await sound.playAsync();
        })();
    };

    const gotoPhoto = () => {
        alert('continue with' + scannedCode)
    }

    const resetCapture = () => {
        setScannedCode('')
        setScanned(false)
    }

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return <View style={containerStyles.container}>
        <View style={headerStyles.container}>
            <Text style={headerStyles.title}>Captura de código</Text>
        </View>
        <View style={BodyStyles.container}>
            <View style={BodyStyles.scanner}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                />
            </View>
            <View style={BodyStyles.legendContainer}>
                <Text style={BodyStyles.legend}>Apunta la camara al código</Text>
            </View>
        </View>
        <View style={controlsStyles.container}>
            <View style={controlsStyles.containerCodebarInput}>
                <TextInput
                    style={controlsStyles.codebarInput}
                    onChangeText={setScannedCode}
                    value={scannedCode}
                />
            </View>
            <View style={controlsStyles.containerControls}>
                {
                    scanned ? <TouchableOpacity
                        onPress={resetCapture}
                        style={[controlsStyles.button, controlsStyles.buttonSecondaryActive, { flex: 1 }]}>
                        <Text style={[controlsStyles.textButtonWhite, { fontSize: 20 }]}>Limpiar</Text>
                    </TouchableOpacity>
                        :
                        <View
                            style={[controlsStyles.button, controlsStyles.buttonSecondaryDisabled, { flex: 1 }]}>
                            <Text style={[controlsStyles.textButtonMutted, { fontSize: 20 }]}>No capturado</Text>
                        </View>
                }
                {
                    scanned ? <TouchableOpacity
                        onPress={gotoPhoto}
                        style={[controlsStyles.button, controlsStyles.buttonPrimary, { flex: 1 }]}>
                        <Text style={[controlsStyles.textButtonWhite, { fontSize: 20 }]}>Continuar</Text>
                    </TouchableOpacity>
                        :
                        <TouchableOpacity
                            style={[controlsStyles.button, controlsStyles.buttonPrimaryDisabled, { flex: 1 }]}>
                            <Text style={[controlsStyles.textButtonMutted, { fontSize: 20 }]}>Sin datos</Text>
                        </TouchableOpacity>
                }
            </View>
        </View>
    </View>
}

const containerStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#401c80'
    },
});

const headerStyles = StyleSheet.create({
    container: {
        flex: 1,
        height: 100,
        backgroundColor: '#401c80',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: '#eee',
        fontSize: 22,
        fontWeight: 'bold'
    }
});

const BodyStyles = StyleSheet.create({
    container: {
        flex: 6,
        backgroundColor: '#2e155a',
        padding: 20,
        // borderWidth: 4,
        borderColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    scanner: {
        height: '90%',
        width: '100%'
    },
    legendContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: '10%',
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
        backgroundColor: '#392b52',
        paddingHorizontal: 20
    },
    containerCodebarInput: {

    },
    codebarInput: {
        fontSize: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        color: 'white',
        height: 48,
        margin: 14,
        borderWidth: 0,
        shadowColor: 'black',
        padding: 10,
        borderRadius: 4,
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
    buttonPrimary: {
        backgroundColor: 'rgba(103, 58, 183, 1)'
    },
    buttonPrimaryDisabled: {
        backgroundColor: 'rgba(103, 58, 183, .2)'
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
    textButtonWhite: {
        color: '#eee'
    },
    textButtonMutted: {
        color: 'rgba(255, 255, 255, .5)'
    }
});



export default CaptureCodebarView;