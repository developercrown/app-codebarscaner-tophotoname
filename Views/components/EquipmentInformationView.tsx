import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import useSound from '../../hooks/useSound';
import { LoadingPicture } from '../../assets/images';
import ScreenView from '../../components/ScreenView';
import Navigator from '../../components/Navigator';
import { colors, textStyles } from '../../components/Styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GradientButton } from '../../components/FormComponents';

const EquipmentInformationView = (props: any) => {
    const {navigation, route} = props;
    const {code} = route.params;

    const sound = useSound(); 
    const [wait, setWait] = useState<boolean>(false);
    const [data, setData] = useState<any>(null);

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const getInformation = async (code: any) => {
        setWait(true);
        const uri = 'https://api-inventario-minify.upn164.edu.mx/api/v1/rows/' + code;
        axios({
            method: 'get',
            url: uri,
        }).then(({status, data}) => {
            if(status === 200){
                console.log(data.data);
                setData(data.data);
            }
            setWait(false);
        }).catch(err => {
            sound.error()
            Alert.alert('Atención!', 'No se encontro el equipo, ¿Desea registrarlo?', [
                {
                    text: 'OK', onPress: () => navigation.navigate('RegisterEquipment')
                },
                {
                    text: 'Cancel',
                    onPress: () => {
                        sound.touch()
                        navigation.goBack()
                    },
                    style: 'cancel',
                },
            ])
            
        });
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            return true;
        });

        getInformation(code);

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    });

    return <View style={[styles.container]}>
        {
            data && data !== null ? <>
                <ScreenView style={[styles.container]} styleContainer={styles.screenViewContainer}>
                    <View style={[styles.pictureContainer, {width: windowWidth}]}>
                        <Image source={LoadingPicture} style={styles.picture} />
                    </View>
                    <View style={[styles.card, {width: windowWidth-40}]}>
                        <Text style={[
                            styles.textPadding,
                            textStyles.alignCenter,
                            textStyles.xl,
                            textStyles.bold
                        ]}>{data.codebar}</Text>
                        <Text style={[
                            {paddingTop: 10},
                            styles.textPadding,
                            textStyles.alignCenter,
                            textStyles.sm
                        ]}>{data.equipment_name}</Text>

                        <Text style={[
                                {paddingTop: 6},
                                styles.textPadding,
                                textStyles.alignCenter,
                                textStyles.sm
                            ]}><Text style={textStyles.bold}>Estado Actual: </Text>{data.status}</Text>
                        
                        {
                            !data.review_status ? 
                                <View style={[
                                    {
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        paddingVertical: 10,
                                        flexDirection: 'row'
                                    }]}>
                                    <Ionicons name="checkmark" size={40} style={[colors.forestgreen]} />
                                    <Text
                                        style={[
                                        textStyles.sm,
                                        textStyles.bold,
                                        colors.forestgreen
                                    ]}>REVISADO</Text>
                                </View>
                            :
                            <View style={[{alignItems: 'center', paddingVertical: 10}]}>
                                <GradientButton
                                    colors={
                                        [
                                            colors.firebrick.color,
                                            colors.firebrick.color
                                        ]
                                    }
                                    onTouch={()=>navigation.navigate("EquipmentReview", {code})}
                                    style={{
                                        elevation: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexDirection: 'row'
                                    }}
                                >
                                    <Ionicons name="close" size={40} style={[colors.white]} />
                                    <Text
                                        style={[
                                        textStyles.sm,
                                        textStyles.bold,
                                        colors.white
                                    ]}>Sin Revisión Previa</Text>
                                </GradientButton>
                            </View>
                        }
                        
                    </View>
                    <View style={[styles.body, { width: windowWidth }]}>

                            <Text style={[
                                {paddingTop: 2},
                                styles.textPadding,
                                textStyles.alignLeft,
                                textStyles.sm
                            ]}><Text style={textStyles.bold}>Departamento Resguardante: </Text>{data.safeguard_apartment}</Text>
                            <Text style={[
                                {paddingTop: 2},
                                styles.textPadding,
                                textStyles.alignLeft,
                                textStyles.sm
                            ]}><Text style={textStyles.bold}>Responsable Resguardante: </Text>{data.safeguard_person}</Text>

                            <Text style={[
                                {paddingTop: 10},
                                styles.textPadding,
                                textStyles.alignLeft,
                                textStyles.sm
                            ]}><Text style={textStyles.bold}>Ubicación actual: </Text>{data.location ? data.location : 'No localizado'}</Text>
                            <Text style={[
                                {paddingTop: 2},
                                styles.textPadding,
                                textStyles.alignLeft,
                                textStyles.sm
                            ]}><Text style={textStyles.bold}>Marca: </Text>{data.trademark}</Text>
                            <Text style={[
                                {paddingTop: 2},
                                styles.textPadding,
                                textStyles.alignLeft,
                                textStyles.sm
                            ]}><Text style={textStyles.bold}>Modelo: </Text>{data.model}</Text>
                            <Text style={[
                                {paddingTop: 2},
                                styles.textPadding,
                                textStyles.alignLeft,
                                textStyles.sm
                            ]}><Text style={textStyles.bold}>Series: </Text>{data.series}</Text>
                            <Text style={[
                                {paddingTop: 2},
                                styles.textPadding,
                                textStyles.alignLeft,
                                textStyles.sm
                            ]}><Text style={textStyles.bold}>Notas Adicionales: </Text>{data.notes}</Text>


                            <Text style={[
                                {paddingTop: 10},
                                styles.textPadding,
                                textStyles.alignLeft,
                                textStyles.sm
                            ]}><Text style={textStyles.bold}>Fecha de registro: </Text>{data.created_at}</Text>
                            <Text style={[
                                {paddingTop: 10},
                                styles.textPadding,
                                textStyles.alignLeft,
                                textStyles.sm
                            ]}><Text style={textStyles.bold}>Ultima Actualización: </Text>{data.updated_at}</Text>
                    </View>
                </ScreenView>
                <Navigator navigation={navigation}/>
            </> 
        :
            <View style={[styles.container, {
                width: windowWidth,
                height: windowHeight,
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.6)'
            }]}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={[
                    textStyles.alignCenter,
                    colors.white,
                    {paddingTop: 10}
                ]}>Cargando la información...</Text>
            </View>
        }
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'flex-start',
        // justifyContent: 'flex-start',
        backgroundColor: 'transparent',
    },
    screenViewContainer: {
        paddingVertical: 0,
        paddingBottom: 100,
        // backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'flex-start',
        zIndex: 1
    },
    pictureContainer: {
        overflow: 'hidden',
        // borderRadius: 20,
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
        minHeight: 100,
        maxHeight: 300,
        zIndex: 1
    },
    picture: {
        
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        minHeight: 140,
        top: -20,
        zIndex: 4
    },
    body: {
        paddingVertical: 0
    },
    textPadding: {
        paddingHorizontal: 16
    }
});

export default EquipmentInformationView;