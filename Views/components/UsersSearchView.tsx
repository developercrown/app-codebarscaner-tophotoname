import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, Dimensions, StatusBar, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native"
import { SwipeListView } from "react-native-swipe-list-view";
import { Input } from "../../components/FormComponents";
import InternalHeader from "../../components/InternalHeader";
import { colors, fontStyles, textStyles } from "../../components/Styles";
import AuthContext from "../../context/AuthProvider";
import ConfigContext from "../../context/ConfigProvider";
import useAxios from "../../hooks/useAxios";
import useHeaderbar from "../../hooks/useHeaderbar";
import useSound from "../../hooks/useSound";
import Ionicons from '@expo/vector-icons/Ionicons';
import PaginatorResponse from "../../models/PaginatorResponse";
import Constants from 'expo-constants';
import ImagenComponent from "../../components/ImagenComponent";
import FullScreenSelectorComponent from "../../components/FullScreenSelectorComponent";

const availableFilters = [
    {
        label: 'Administrador',
        payload: {
            role: 'admin',
            label: 'Administrador',
        }
    },
    {
        label: 'Capturador',
        payload: {
            role: 'support',
            label: 'Capturador',
        }
    },
    {
        label: 'Consultor',
        payload: {
            role: 'viewer',
            label: 'Consultor',
        }
    }
]

const UsersSearchView = (props: any) => {
    const { navigation } = props;
    const { config }: any = useContext(ConfigContext);
    const { auth }: any = useContext(AuthContext);
    const { instance } = useAxios(config.servers.app);
    
    const windowHeight = Dimensions.get('window').height;
    const sound = useSound();

    const [serverPath, setServerPath] = useState<string>('');
    const [wait, setWait] = useState<boolean>(false);
    const [waitMessage, setWaitMessage] = useState<string>("");
    const [viewSelectRole, setViewSelectRole] = useState<boolean>(false);
    const [currentUserSelected, setCurrentUserSelected] = useState<any>(null);

    const [inputPlaceholder, setInputPlaceholder] = useState<string>('');

    const [rows, setRows] = useState<any>([]);

    const [pageProps, setPageProps] = useState<any>(
        {
            currentPage: 0,
            lastPage: 0,
            itemsPerPage: 0,
            indexFrom: 0,
            indexTo: 0,
            totalItems: 0
        }
    );
    
    const [search, setSearch] = useState<string>("");
    const searchBoxRef = useRef();
    const listRef = useRef<any>();


    useHeaderbar({ hide: true, navigation });
    
    const notResultFailback = (message: string) => {
        Alert.alert( 'Atención!', message);     
        setRows([])
        setWait(false)
        setPageProps({
            currentPage: 0,
            lastPage: 0,
            itemsPerPage: 0,
            indexFrom: 0,
            indexTo: 0,
            totalItems: 0
        })
    }

    const addKeys = (sourceRows: Array<any>): Array<any> => {
        const output = sourceRows.map((row, key) => {
            return {
                ...row,
                identifier: row.key,
                key,
            }
        })
        return output
    }

    const searchRows = (page: number = 1) => {
        let message = '';

        if(page >= 2){
            message = "Solicitando más elementos";
        } else {
            if(listRef && listRef.current){
                listRef.current._listView.scrollToOffset({ offset: 0, animated: true });
            }
            if(search === ""){
                message = "Obteniendo información";
            } else {
                message = "Buscando";
            }
        }


        setWaitMessage(message)
        setWait(true)

        const config = {
            validateStatus: () => true
        }

        const query = (search!== '' && search.length > 1) ? `&search=${search}` : '';
        const path = `/users?page=${page}${query}`;
        
        instance.get(path, config).then((response: any) => {
            const { status } = response;
            const data: PaginatorResponse = response.data;
            
            if (status === 200) {
                let results = data.data;
                const paginatorConfig = {
                    currentPage: data.current_page,
                    lastPage: data.last_page,
                    itemsPerPage: data.per_page,
                    indexFrom: data.from,
                    indexTo: data.to,
                    totalItems: data.total
                }
                if (results.length >= 1) {                    
                    setPageProps(paginatorConfig);
                    
                    if(page === 1){
                        results = addKeys(results)                        
                        setRows(results)
                    } else if(page >= 2){
                        let newData = [
                            ...rows,
                            ...results
                        ];
                        newData = addKeys(newData)
                        setRows(newData)
                    }
                    setWait(false)
                    return
                }
                notResultFailback("No se encontraron registros en el sistema");
                return
            } else if(status === 401) {
                handleBack()
                notResultFailback("No tienes autorización para consultar el recurso");
                return
            }
            notResultFailback("No se pudieron obtener los registros, verifique su información");
        }).catch((err: any) => {
            notResultFailback("Ocurrio un error al consultar la información, intentelo más tarde.");
        })
        return
    }

    const handleEndReached = (props: any) => {
        if(pageProps.currentPage < pageProps.lastPage){
            searchRows(pageProps.currentPage+1)
        }
    }

    useFocusEffect(
        useCallback(() => {
            if (config.servers.app) {
                const rootServer = (config.servers.app + '').split('/api/')
                if (rootServer && rootServer.length > 0) {
                    setServerPath(rootServer[0])
                    searchRows()
                }
            }
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    const handleBack = () => {
        if (!wait) {
            sound.back();
            navigation.goBack();
            return
        }
        sound.touch();
    }
    
    useEffect(() => {
        const backAction = () => {
            handleBack()
            return true;
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => {
            backHandler.remove();
        }
    })

    const newUser = () => {
        sound.drop()
        navigation.navigate(
            "RegisterUser"
        );
    }

    const header = <>
        <StatusBar barStyle="light-content" backgroundColor='rgba(10, 10, 10, 1)' />
        {
            <InternalHeader title={"Listado de usuarios"} leftIcon="chevron-back" leftAction={handleBack} rightIcon="person-add" rightAction={newUser} style={{ backgroundColor: 'rgba(0, 0, 0, .5)' }} />
        }
    </>

    const closeRow = (rowMap: any, rowKey: any) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const handleEditRow = (data: any) => {
        sound.drop()
        if(auth.data.key === data.identifier){
            Alert.alert(
                'Denegado!',
                'No puedes realizar operaciones a tu usuario',
                [
                    {
                        text: 'Entendido'
                    }
                ]
            )
            return
        }
        setCurrentUserSelected(data)
        setViewSelectRole(true)
    }

    const deleteRow = (data: any) => {
        setWaitMessage('Eliminando usuario del sistema')
        setWait(true)

        setTimeout(() => {
            const config = {
                validateStatus: () => true
            }
            instance.delete(`/users/${data.identifier}`, config).then((response: any) => {
                const { data, status } = response;                
                if (status === 200) {
                    Alert.alert( 'Listo!', "Usuario borrado con exito");
                    searchRows()
                    return
                } else if(status === 401) {
                    handleBack()
                    notResultFailback("No tienes autorización para eliminar el usuario");
                    return
                }
                Alert.alert( 'Aviso!', "No se pudo realizar la operación");
            }).catch((err: any) => {
                notResultFailback("Ocurrio un error al procesar tu solicitud, intentelo más tarde.");
            })
            setWait(false)
        }, 150);
        return
    }

    const handleDeleteRow = (data: any) => {
        sound.notification();
        if(auth.data.key === data.identifier){
            Alert.alert(
                'Denegado!',
                'No puedes realizar operaciones a tu usuario',
                [
                    {
                        text: 'Entendido'
                    }
                ]
            )
            return
        }
        
        Alert.alert(
            'Confirmación!',
            '¿Esta seguro de eliminar el usuario del sistema?',
            [
                {
                    text: 'Borrarlo', onPress: () => {
                        Alert.alert(
                            'Aviso!',
                            '¿Seguro que quieres continuar con el proceso de borrado?, recuerda que esta acción no se puede revertir',
                            [
                                {
                                    text: 'Continuar', onPress: () => {
                                        sound.touch();
                                        deleteRow(data)
                                    }
                                },
                                {
                                    text: 'Cancelar',
                                    onPress: () => {
                                        sound.touch()
                                    },
                                    style: 'cancel',
                                },
                            ]
                        )
                    }
                },
                {
                    text: 'Cancelar',
                    onPress: () => {
                        sound.touch()
                    },
                    style: 'cancel',
                },
            ]
        )
    }

    const disableAllFullscreenElements = () => {
        setViewSelectRole(false)
    }

    const updateUserRole = (id: number, role: any) => {
        const config = {
            validateStatus: () => true
        }
        instance.put(`/users/role/${id}`, { role }, config).then((response: any) => {
            const { status } = response; 
            if (status === 200) {
                Alert.alert( 'Listo!', "Rol reasignado con exito");
                searchRows()
                return
            } else if(status === 401) {
                handleBack()
                notResultFailback("No tienes autorización para actualizar al usuario");
                return
            }
            Alert.alert( 'Aviso!', "No se pudo realizar la operación");
        }).catch((err: any) => {
            notResultFailback("Ocurrio un error al procesar tu solicitud, intentelo más tarde.");
        })
    }

    const handleRoleSelect = (results: any) => {
        sound.drop();
        disableAllFullscreenElements();
        const role = results.role;
        Alert.alert('Confirmación', `¿Estas seguro de asignar el rol de "${results.label}" al usuario: ${currentUserSelected.firstname} ${currentUserSelected.lastname}?, esta acción no se puede revertir`, [
            {
                text: 'Cancelar',
                onPress: () => null,
                style: 'cancel',
            },
            {
                text: 'Continuar',
                onPress: () => {
                    updateUserRole(currentUserSelected.identifier, role)
                }
            },
        ]);
    }

    const roleTraslator = (role: string) => {
        switch (role.toLowerCase()) {
            case 'viewer':
                return 'Consultor'
            case 'support':
                return "Capturador"
            case 'admin':
                return 'Administrador'
            default:
                return 'No identificado'
        }
    }

    const renderItem = (data: any) => {
        
        let status: any = (data.item.status+'').toLowerCase();
        status = (status == 'activo' || status == 'bueno') ? true : false;
        
        return <TouchableHighlight
            // onPress={() => gotoInformation(data.item)}
            style={styles.rowFront}
            underlayColor={'#AAA'}
        >
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 4}}>
                <View style={{ width: '30%', justifyContent: 'center', alignItems: 'center', padding: 4}}>
                    <TouchableOpacity
                        onPress={() => {
                            sound.echo()
                        }}
                        style={{elevation: 1}}
                    >
                        <ImagenComponent
                            key={data.item.codebar}
                            uri={`https://api-shield.upn164.edu.mx/pictures/thumbs/${data.item.picture}`}
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 20,
                                backgroundColor: '#333'
                            }}
                            loading={wait}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{width: '70%'}}>
                    <Text style={[fontStyles.nunito, fontStyles.nunitoBlack, {}]}>{data.item.username}</Text>
                    <Text style={[fontStyles.nunito,]}>{`${data.item.firstname} ${data.item.lastname} ${data.item.surname}`}</Text>
                    <Text style={[fontStyles.nunito,]}>{`${roleTraslator(data.item.role)}`}</Text>
                </View>
            </View>
        </TouchableHighlight>
    };

    const renderHiddenItem = (data: any, rowMap: any) => {
        return (
            <View style={styles.rowBack}>
                {
                    <TouchableOpacity
                        style={[{justifyContent: "center", alignItems: "center"}]}
                        onPress={() => {closeRow(rowMap, data.item.key); handleEditRow(data.item)}}
                    >
                        <Ionicons name="briefcase" size={24} style={[colors.dark]} />
                        <Text style={[colors.black, textStyles.pico]}>Editar rol</Text>
                    </TouchableOpacity>
                }

                {
                    <TouchableOpacity
                        style={[styles.backRightBtn, styles.backRightBtnLeft]}
                        
                        onPress={() => {closeRow(rowMap, data.item.key); handleDeleteRow(data.item)}}
                    >
                        <Ionicons name="trash" size={24} style={[colors.red]} />
                        <Text style={colors.red}>Eliminar</Text>
                    </TouchableOpacity>
                }

                <TouchableOpacity
                    style={[styles.backRightBtn, {justifyContent: "center", alignItems: "center", right: 0,}]}
                    onPress={() => closeRow(rowMap, data.item.key)}
                >
                    <Ionicons name="close" size={24} style={[colors.dark]} />
                    <Text style={[colors.dark, fontStyles.nunitoBold, textStyles.xs]}>Cerrar</Text>
                </TouchableOpacity> 
                
            </View>
        )
    };

    return <View style={[styles.container]}>
        {header}

        {
            wait && <View style={[styles.contentView]}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={[
                    textStyles.alignCenter,
                    colors.white,
                    { paddingTop: 10 }
                ]}>{waitMessage}</Text>
            </View>
        }

        {
            !wait &&
            viewSelectRole &&
            <FullScreenSelectorComponent
                icon="filter"
                data={availableFilters}
                title={"Selecciona el rol a asignar"}
                onExit={() => { setViewSelectRole(false); sound.back(); }}
                onSelect={handleRoleSelect}
                />
            
        }

        <View
            style={[styles.container]}
        >
            <View style={{
                width: "100%",
                height: 70,
                justifyContent: "space-around",
                alignItems: "center",
                flexDirection: "row",
                backgroundColor: "#aaa"
            }}>
                <Input
                    icon="search"
                    styleInput={[{ padding: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)' }]}
                    styleContainer={[{ width: '90%', paddingHorizontal: 8}]}
                    placeholder={"ingresa tu dato de busqueda"}
                    ref={searchBoxRef}
                    onChange={setSearch}
                    actionLeftIcon={() => searchRows()}
                    onSubmit={() => searchRows()}
                    value={search}
                />
            </View>
            <View style={{
                width: "100%",
                height: 40,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                backgroundColor: "#bbb"
            }}>
                <View>
                    <Text style={[fontStyles.nunito, textStyles.pico]}>
                        Sección <Text style={[fontStyles.nunitoBold]}>{pageProps.currentPage}</Text> de <Text style={[fontStyles.nunitoBold]}>{pageProps.lastPage}</Text>
                    </Text>
                </View>
                <View>
                    <Text style={[fontStyles.nunito, textStyles.pico]}>
                        Indice: <Text style={[fontStyles.nunitoBold]}>{pageProps.indexFrom}</Text> a <Text style={[fontStyles.nunitoBold]}>{pageProps.indexTo}</Text>
                    </Text>
                </View>
                <View>
                    <Text style={[fontStyles.nunito, textStyles.pico]}><Text style={[fontStyles.nunitoBold]}>{pageProps.totalItems}</Text> Resultados</Text>
                </View>
            </View>

            <View style={{
                width: "100%",
                height: windowHeight - 110 - (Constants.statusBarHeight + 32),
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "flex-start",
                paddingTop: 0,
                margin: 'auto',
                backgroundColor: "rgba(255, 255, 255, 0)"
            }}>
                {
                    rows && rows.length > 0 ?
                        <SwipeListView
                            ref={listRef}
                            data={rows}
                            renderItem={renderItem}
                            renderHiddenItem={renderHiddenItem}
                            leftOpenValue={auth.data?.role === 'viewer' ? 0 : 75}
                            rightOpenValue={auth.data?.role === 'viewer' ? 0 : -150}
                            previewRowKey={'0'}
                            previewOpenValue={-40}
                            previewOpenDelay={3000}
                            onEndReached={handleEndReached}
                        />
                        :
                        <Text style={[textStyles.shadowLight, textStyles.lg, fontStyles.nunitoBold, colors.white, { marginTop: 40}]}>Sin registros</Text>
                }
            </View>
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0)',
    },

    contentView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, .8)',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        zIndex: 99
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        justifyContent: 'center',
        borderBottomColor: 'rgba(0, 0, 0, .2)',
        borderBottomWidth: 1,
        height: 100,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        height: 100,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        right: 75,
    },
    backRightBtnRight: {
        right: 10,
    },
    trash: {
        height: 25,
        width: 25,
    },
});

export default UsersSearchView;