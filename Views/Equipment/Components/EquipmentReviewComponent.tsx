import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { Picker } from '@react-native-picker/picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { InfoRow } from "./EquipmentInformationComponent";
import { useState } from "react";
import axios from "axios";
import useSound from "../../../hooks/useSound";

const locations = [
    'Oficina Subdirección Administrativa',
    'Dpto.Recursos Humanos',
    'Dpto.Finanzas',
    'Dpto.Servicios Escolares',
    'Dpto.Apoyo a estudiantes',
    'Dpto.Prevención y Salud',
    'Recepción',
    'Dirección',
    'Sala de juntas',
    'Cocina Académicos',
    'Oficinas Académicos',
    'Dpto.Sistemas y Tecnologias',
    'Dpto.Aula Invertida',
    'Biblioteca',
    'Prefectura',
    'Dpto.Titulación',
    'Área.Jardineros',
    'Sala de profesores',
    'Terraza',
    'Domo',
    'Cabina de seguridad',

    'Edificio B. Salon-1[B1]',
    'Edificio B. Salon-2[B2]',
    'Edificio B. Salon-3[B3]',
    'Edificio B. Salon-4[B4]',
    'Edificio B. Salon-5[B5]',

    'Edificio C. Salon-1[C1]',
    'Edificio C. Salon-2[C2]',
    'Edificio C. Salon-3[C3]',
    'Edificio C. Salon-4[C4]',

    'Edificio D. Salon-4[D4]',
    'Edificio D. Salon-5[D5]',
    'Edificio D. Salon-6[D6]',
    'Edificio D. Salon-7[D7]',

    'Edificio E. Salon-1[E1]',
    'Edificio E. Salon-2[E2]',

    'Edificio F. Salon-3[F3]',
    'Edificio F. Salon-4[F4]',
    'Edificio F. Salon-5[F5]',
    'Edificio F. Salon-6[F6]',
    'DESCONOCIDO',
]

const EquipmentReviewComponent = (props: any) => {
    const { data, gotoInit, gotoContinue } = props
    const sound = useSound(); 
    const [notesValue, setNotesValue] = useState<any>(data.notes ? data.notes : 'Sin notas');
    const [locationValue, setLocationValue] = useState<any>(data.location ? data.location : 'DESCONOCIDO');
    const [statusEquipment, setStatusEquipment] = useState<any>(data.status ? data.status : 'ACTIVO');
    const { alignCenter, textSm, textMd, textWhite, textBold } = GlobalStyles
    const [wait, setWait] = useState<boolean>(false);

    let description = [data.equipment_name, data.trademark, data.model].join(" - ");
    let safeguard = [data.safeguard_apartment, data.safeguard_person].join(", ");

    const gotoCancel = () => {
        sound.cancel()
        gotoInit()
    }

    const storeReview = () => {
        const payload = {
            notes: notesValue,
            location: locationValue,
            status: statusEquipment
        }
        setWait(true)
        const uri = 'https://api-inventario-minify.upn164.edu.mx/api/v1/rows/' + data.codebar;
        axios({
            method: 'put',
            url: uri,
            data: payload
        }).then(({status, data}) => {            
            if(status === 200){
                alert("Registrado correctamente")
            }
            sound.success();
            gotoContinue(data.codebar)            
        }).catch(err => {
            alert("no se pudo registrar la información")
            sound.cancel()
            setWait(false)
        });
    }

    return <ScrollView >
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
                        <Text style={{ color: '#eee' }}>Cargando la información...</Text>
                    </View>
        }
        {
            data && <View style={BodyStyles.container}>
                <View style={{ marginTop: 10, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={[textMd, textWhite, textBold, { textAlign: 'center' }]}>Revisión del equipo</Text>
                </View>
                <View style={BodyStyles.informationContainer}>
                    <View style={{ backgroundColor: 'rgba(20, 20, 20, 0.6)', padding: 10, borderRadius: 10, marginTop: 4 }}>
                        <InfoRow label="Código" value={data.codebar} />
                        <InfoRow label="Descripción" value={description} />
                        <InfoRow label="Series registradas" value={data.series} />
                        <InfoRow label="Información Resguardo actual" value={safeguard} />
                        <InfoRow label="Estado actual" value={data.status} />
                    </View>

                    <View style={{ padding: 10, marginTop: 4 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 10 }}>Notas:</Text>
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
                            value={notesValue}
                            placeholder="Ingresa tus observaciones aquí"
                            onChangeText={setNotesValue}
                        />
                    </View>
                    <View style={{ padding: 10, marginTop: 4 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 10 }}>Ubicación Actual:</Text>
                        <Picker
                            style={{
                                backgroundColor: 'rgba(3, 102, 181, .5)',
                                color: '#eee',
                                fontWeight: 'bold',
                                borderWidth: 1,
                                borderColor: 'rgba(255, 255, 255, .4)'
                            }}
                            selectedValue={locationValue}
                            onValueChange={(itemValue, itemIndex) =>
                                setLocationValue(itemValue)
                            }>
                            {
                                locations.map((e, key) => <Picker.Item key={key} label={e} value={e} />)
                            }
                        </Picker>
                    </View>
                    <View style={{ padding: 10, marginTop: 4 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 10 }}>Estado Actual:</Text>
                        <Picker
                            style={{
                                backgroundColor: 'rgba(3, 102, 181, .5)',
                                color: '#eee',
                                fontWeight: 'bold',
                                borderWidth: 1,
                                borderColor: 'rgba(255, 255, 255, .4)'
                            }}
                            selectedValue={statusEquipment}
                            onValueChange={(itemValue, itemIndex) =>
                                setStatusEquipment(itemValue)
                            }>
                            <Picker.Item label="ACTIVO" value="ACTIVO" />
                            <Picker.Item label="BAJA" value="BAJA" />
                        </Picker>
                    </View>
                    <View style={{ padding: 10, marginTop: 4, flex: 1, flexDirection: 'row' }}>
                        <TouchableOpacity
                            onPress={gotoCancel}
                            style={[controlsStyles.button, controlsStyles.buttonDanger, { borderRadius: 2, flex: 1}]}>
                            <Ionicons name="close" size={40} style={{ color: 'white' }} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={storeReview}
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
                </View>
            </View>}
    </ScrollView>
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


const BodyStyles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(59, 0, 153, 0.2)',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
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

export {locations}
export default EquipmentReviewComponent;