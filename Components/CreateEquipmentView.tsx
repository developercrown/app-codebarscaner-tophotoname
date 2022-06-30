import { useEffect, useState } from 'react';
import { Alert, TextInput, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { BlurView } from 'expo-blur';
import { InfoRow } from './EquipmentInformationComponent';
import { locations } from './EquipmentReviewComponent';
import { Picker } from '@react-native-picker/picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import useSound from '../hooks/useSound';


const Input = (props: any) => {
    const { label, value, onChange } = props;

    return <View style={{ marginTop: 10 }}>
        <Text style={{ color: '#eee', fontWeight: 'bold', fontSize: 18 }}>{label}</Text>
        <TextInput value={value} onChangeText={onChange} style={
            {
                color: '#eee',
                backgroundColor: "rgba(0,0,0,.5)",
                paddingVertical: 10,
                paddingHorizontal: 16,
                marginTop: 10,
                borderRadius: 4,
                fontSize: 16
            }
        } />
    </View>
}

const Select = (props: any) => {
    const { items, onChange, value } = props
    return <View style={{ padding: 10, marginTop: 4 }}>
        <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 10 }}>Ubicación Actual:</Text>
        <Picker
            style={{
                backgroundColor: 'rgba(3, 102, 181, .5)',
                color: '#eee',
                fontWeight: 'bold',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, .4)'
            }}
            selectedValue={value}
            onValueChange={(itemValue) =>
                onChange(itemValue)
            }>
            {
                items.map((e: any, key: number) => <Picker.Item key={key} label={e} value={e} />)
            }
        </Picker>
    </View>
}

const TextArea = (props: any) => {
    const { onChange, value, label, placeholder } = props
    return <View style={{ padding: 10, marginTop: 4 }}>
        <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 10 }}>{label}:</Text>
        <TextInput
            style={[
                BodyStyles.input,
                {
                    backgroundColor: 'rgba(0, 0, 0, .5)',
                    color: '#eee',
                    height: 80,
                    padding: 10,
                    justifyContent: 'center',
                    textAlignVertical: 'top',
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, .2)'
                }
            ]}
            multiline={true}
            value={value}
            placeholder={placeholder}
            onChangeText={onChange}
        />
    </View>
}

const CreateEquipmentView = (props: any) => {
    const { codebar, gotoInit, gotoNext } = props;
    const sound = useSound();
    const [wait, setWait] = useState<boolean>(false);
    const [name, setName] = useState('');
    const [series, setSeries] = useState('');
    const [trademark, setTrademark] = useState('');
    const [model, setModel] = useState('');
    const [status, setStatus] = useState('ACTIVO');
    const [safeguardApartment, setSafeguardApartment] = useState('');
    const [safeguardPerson, setSafeguardPerson] = useState('');
    const [notes, setNotes] = useState('');
    const [location, setLocation] = useState('DESCONOCIDO');

    const gotoCancel = () => {
        gotoInit();
    }

    const gotoContinue = () => {
        gotoNext(codebar)
    }

    const saveRow = () => {
        const payload = {
            codebar,
            name,
            series,
            trademark,
            model,
            status,
            safeguardApartment,
            safeguardPerson,
            notes,
            location
        };
        setWait(true)
        const uri = 'https://api-inventario-minify.upn164.edu.mx/api/v1/rows/';
        axios({
            method: 'post',
            url: uri,
            data: payload
        }).then(({status, data}) => {
            if(status === 200){
                alert("Registrado correctamente")
            }
            sound.success();
            gotoContinue();
        }).catch(err => {
            alert("no se pudo registrar la información")
            sound.cancel()
            setWait(false)
        });
    }

    return <View style={containerStyles.container}>
        {
            wait && <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    top: 0,
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    backgroundColor: 'rgba(0, 0, 0, .5)',
                    zIndex: 2
                }}
            >
                <Text style={{ color: '#eee' }}>Un momento por favor...</Text>
            </View>
        }
        <BlurView intensity={10} style={headerStyles.container} tint="light">
            <Text style={headerStyles.title}>Registro de equipo</Text>
        </BlurView>
        <ScrollView style={[BodyStyles.container, {paddingBottom: 100}]}>
            <InfoRow value={codebar} label="Código de barras" />
            <Input label="Nombre del equipo" value={name} onChange={setName} />
            <Input label="Series o códigos" value={series} onChange={setSeries} />
            <Input label="Marca" value={trademark} onChange={setTrademark} />
            <Input label="Modelo" value={model} onChange={setModel} />
            <Select label="Estado" items={['ACTIVO', 'BAJA']} value={status} onChange={setStatus} />
            <Input label="Departamento resguardante" value={safeguardApartment} onChange={setSafeguardApartment} />
            <Input label="Persona resguardante" value={safeguardPerson} onChange={setSafeguardPerson} />
            <TextArea label="Notas" placeholder="Ingresa tus observaciones aquí" value={notes} onChange={setNotes} />
            <Select label="Ubicación Actual" items={locations} value={location} onChange={setLocation} />
            <View style={{ padding: 10, marginTop: 4, marginBottom:50, flex: 1, flexDirection: 'row' }}>
                <TouchableOpacity
                    onPress={gotoCancel}
                    style={[controlsStyles.button, controlsStyles.buttonDanger, { borderRadius: 2, flex: 1}]}>
                    <Ionicons name="close" size={40} style={{ color: 'white' }} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={saveRow}
                    style={[
                        controlsStyles.button,
                        {
                            backgroundColor: 'green',
                            flex: 3,
                            flexDirection: 'row'
                        }]}>
                    <Text style={{color: 'white', marginRight: 10}}>Registrar Revisión</Text>
                    <Ionicons name="save-outline" size={28} style={{ color: 'white' }} />
                </TouchableOpacity>
            </View>
        </ScrollView>
    </View>
}

const GlobalStyles = StyleSheet.create({
    alignCenter: {
        textAlign: 'center'
    },
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

const headerStyles = StyleSheet.create({
    container: {
        height: 60,
        backgroundColor: 'rgba(187, 50, 203, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'rgba(71, 21, 159, .6)',
        borderLeftWidth: 1,
        borderRightWidth: 1,
    },
    title: {
        color: '#eee',
        fontSize: 20,
        fontWeight: 'normal'
    }
});

const containerStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'transparent',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'blue',
    },
});

const BodyStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(59, 0, 153, 0.1)',
        padding: 20,
        borderColor: 'rgba(71, 21, 159, .6)',
        borderWidth: 1
    },
    informationContainer: {
        height: '100%',
        width: '100%',
        paddingBottom: 32,
        flexDirection: 'column'
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
    },
    input: {
        width: '100%',
        height: 44,
        backgroundColor: '#f1f3f6',
        borderRadius: 6,
        paddingHorizontal: 10
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
        justifyContent: 'space-around',
        alignItems: 'center',
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
        borderRadius: 100,
        width: 58,
        height: 58,
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

export default CreateEquipmentView;