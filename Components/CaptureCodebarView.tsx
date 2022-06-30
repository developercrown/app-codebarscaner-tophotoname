import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import useSound from '../hooks/useSound';

const CaptureCodebarView = (props: any) => {
    const sound = useSound(); 
    const {codebar, gotoNext} = props;
    const [scannedCode, setScannedCode] = useState<string | undefined>(codebar ? codebar : '');
    const [hasPermission, setHasPermission] = useState<any>(null);
    const [scanned, setScanned] = useState<any>(false);

    useEffect(() => {
        sound.start();
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = async (props: any) => {
        let { data } = props
        setScanned(true);
        setScannedCode(data);
        sound.msn2()
    };

    const gotoPhoto = () => {
        sound.touch();
        gotoNext(scannedCode)
    }
    
    const resetCapture = () => {
        sound.touch();
        setScannedCode('')
        setScanned(false)
    }

    const handleSend = () => {
        gotoPhoto()
    }

    if (hasPermission === null) {
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text style={{color: 'white'}}>Requesting for camera permission</Text></View>;
    }
    if (hasPermission === false) {
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text style={{color: 'white'}}>No access to camera</Text></View>;
    }


    return <View style={containerStyles.container}>
        <BlurView intensity={10} style={headerStyles.container} tint="light">
            <Text style={headerStyles.title}>Captura de código</Text>
        </BlurView>
        <BlurView intensity={10} style={BodyStyles.container} tint="light">
            <View style={BodyStyles.scanner}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                />
            </View>
            <View style={BodyStyles.legendContainer}>
                <Text style={BodyStyles.legend}>Apunta la camara al código</Text>
            </View>
        </BlurView>
        <View style={controlsStyles.container}>
            <View style={controlsStyles.containerCodebarInput}>
                <TextInput
                    style={controlsStyles.codebarInput}
                    onChangeText={setScannedCode}
                    value={scannedCode}
                    onSubmitEditing={handleSend}
                    keyboardType="number-pad"
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
                        <View
                            style={[controlsStyles.button, controlsStyles.buttonPrimaryDisabled, { borderRadius:10, flex: 1, flexDirection: 'row' }]}>
                            <Text style={[controlsStyles.textButtonMutted, { fontSize: 20 }]}>
                                Continuar
                            </Text>
                            <Ionicons name="arrow-forward" size={26} style={[[controlsStyles.buttonIconWhiteMutted], {marginLeft: 4}]} />   
                        </View>
                }
            </View>
        </View>
    </View>
}

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
        backgroundColor: 'rgba(59, 0, 153, 0.2)',
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
    scanner: {
        height: '100%',
        width: '100%',
        marginBottom: 32,
        borderRadius: 0,
        overflow: 'hidden'
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



export default CaptureCodebarView;