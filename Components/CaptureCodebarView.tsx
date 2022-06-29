import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Audio } from 'expo-av';
import Ionicons from '@expo/vector-icons/Ionicons';

const CaptureCodebarView = (props: any) => {
    //TODO: auto goto next view on capture qr
    const {gotoNext} = props;
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
        gotoNext(scannedCode)
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
                    scannedCode != "" ? <TouchableOpacity
                        onPress={resetCapture}
                        style={[controlsStyles.buttonCycled, controlsStyles.buttonDanger]}>
                        <Text style={[controlsStyles.textButtonWhite, { fontSize: 20 }]}>
                            <Ionicons name="trash" size={26} style={controlsStyles.buttonIconWhite} />
                        </Text>
                    </TouchableOpacity>
                        :
                        <View
                            style={[controlsStyles.buttonCycled, controlsStyles.buttonDarkDisabled]}>
                            <Text style={[controlsStyles.textButtonMutted, { fontSize: 20 }]}>
                                <Ionicons name="trash" size={26} style={controlsStyles.buttonIconWhiteMutted} />
                            </Text>
                        </View>
                }
                {
                    scannedCode != "" ? <TouchableOpacity
                        onPress={gotoPhoto}
                        style={[controlsStyles.button, controlsStyles.buttonPrimary, { borderRadius:10, flex: 1, flexDirection: 'row' }]}>
                        <Text style={[controlsStyles.textButtonWhite, { fontSize: 20 }]}>
                            Continuar
                        </Text>
                        <Ionicons name="arrow-forward" size={26} style={[controlsStyles.buttonIconWhite, {marginLeft: 4}]} />
                    </TouchableOpacity>
                        :
                        <TouchableOpacity
                            style={[controlsStyles.button, controlsStyles.buttonPrimaryDisabled, { borderRadius:10, flex: 1, flexDirection: 'row' }]}>
                            <Text style={[controlsStyles.textButtonMutted, { fontSize: 20 }]}>
                                Continuar
                            </Text>
                            <Ionicons name="arrow-forward" size={26} style={[[controlsStyles.buttonIconWhiteMutted], {marginLeft: 4}]} />   
                        </TouchableOpacity>
                }
            </View>
        </View>
    </View>
}

const containerStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1b1c27'
    },
});

const headerStyles = StyleSheet.create({
    container: {
        flex: 1,
        height: 100,
        backgroundColor: '#1b1c27',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: 'rgba(255,255,255,.2)',
        borderWidth: 1
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
        backgroundColor: '#1b1c27',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    scanner: {
        height: '105%',
        width: '100%'
    },
    legendContainer: {
        width: '93%',
        // backgroundColor: 'rgba(0, 0, 0, .3)',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        height: '10%',
        bottom: 10
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
        backgroundColor: '#212332',
        paddingHorizontal: 20,
        borderColor: "white",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 0,
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



export default CaptureCodebarView;