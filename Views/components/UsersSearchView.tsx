import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, BackHandler, Dimensions, Image, Modal, StatusBar, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native"
import { SwipeListView } from "react-native-swipe-list-view";
import { Input } from "../../components/FormComponents";
import FullScreenImage from "../../components/FullScreenImage";
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
import CodebarReader from "../../components/CodebarReader";

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

    const [inputPlaceholder, setInputPlaceholder] = useState<string>('');
    const [filter, setFilter] = useState<string>('');
    const [filterLabel, setFilterLabel] = useState<string>('');

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

    const handleFilterSelected = (results: any) => {
        sound.drop()
        setCurrentFilter(results)
    }

    const setCurrentFilter = (data: any) => {
        setInputPlaceholder(data.placeholder)
        setFilter(data.filter)
        setFilterLabel(data.referenceLabel)
    }
    
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

        instance.get(`/rows?page=${page}&${filter}=${search}`, config).then((response: any) => {
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
            console.log(err);
            
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

    const gotoInformation = (data: any) => {
        sound.drop()
        navigation.navigate(
            "EquipmentInformation",
            {
                code: data.codebar
            }
        );
    }

    const handleCloneRow = (data: any) => {
        sound.drop()
        navigation.navigate(
            "RegisterEquipment",
            {
                data
            }
        );
    }

    const deleteRow = (data: any) => {
        setWaitMessage('Eliminando equipo del sistema')
        setWait(true)

        setTimeout(() => {
            const config = {
                validateStatus: () => true
            }
    
            instance.delete(`/rows/${data.codebar}`, config).then((response: any) => {
                const { status } = response; 
                if (status === 200) {
                    Alert.alert( 'Listo!', "Equipo borrado con exito");
                    searchRows()
                    return
                } else if(status === 401) {
                    handleBack()
                    notResultFailback("No tienes autorización para eliminar el recurso");
                    return
                }
                Alert.alert( 'Aviso!', "No se logro realizar la operación");
            }).catch((err: any) => {
                notResultFailback("Ocurrio un error al procesar tu solicitud, intentelo más tarde.");
            })
            setWait(false)
        }, 150);
        return
    }

    const handleDeleteRow = (data: any) => {
        sound.notification();
            Alert.alert(
                'Confirmación!',
                '¿Esta seguro de borrar el equipo del sistema?',
                [
                    {
                        text: 'Borrarlo', onPress: () => {
                            Alert.alert(
                                'Aviso!',
                                '¿Seguro que quieres continuar con el borrado?, recuerda que esta acción no se puede revertir',
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

    const renderItem = (data: any) => {
        
        let status: any = (data.item.status+'').toLowerCase();
        status = (status == 'activo' || status == 'bueno') ? true : false;
        
        return <TouchableHighlight
            onPress={() => gotoInformation(data.item)}
            style={styles.rowFront}
            underlayColor={'#AAA'}
        >
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 4}}>
                <View style={{ width: '30%', justifyContent: 'center', alignItems: 'center', padding: 4}}>
                    {/* <TouchableOpacity
                        onPress={() => {
                            sound.echo()
                        }}
                        style={{elevation: 1}}
                    >
                        <ImagenComponent
                            key={data.item.codebar}
                            uri={`${serverPath}/pictures/thumbs/${data.item.picture}`}
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 20,
                                backgroundColor: '#333'
                            }}
                            loading={wait}
                        />
                    </TouchableOpacity> */}
                </View>
                <View style={{width: '70%'}}>
                    <Text style={[fontStyles.nunito, fontStyles.nunitoBlack, {}]}>{data.item.codebar}</Text>
                    <Text style={[fontStyles.nunito,]}>{data.item.equipment_name}</Text>
                </View>
                {
                    !data.item.review_status && <View style={{width: 22, height: 22, position: 'absolute', bottom: 5, right: 8}}>
                        <Ionicons name={"warning"} size={24} style={[colors.darkorange]} />
                    </View>
                }
                <View style={{width: 22, height: 22, position: 'absolute', top: 5, right: 8}}>
                    <Ionicons name={status ? "thumbs-up" : "thumbs-down"} size={24} style={[status ? colors.darkgreen : colors.red]} />
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
                        onPress={() => {closeRow(rowMap, data.item.key); handleCloneRow(data.item)}}
                    >
                        <Ionicons name="copy" size={24} style={[colors.dark]} />
                        <Text style={colors.black}>Clonar</Text>
                    </TouchableOpacity>
                }

                {
                    <TouchableOpacity
                        style={[styles.backRightBtn, styles.backRightBtnLeft]}
                        
                        onPress={() => {closeRow(rowMap, data.item.key); handleDeleteRow(data.item)}}
                    >
                        <Ionicons name="trash" size={24} style={[colors.red]} />
                        <Text style={colors.red}>Borrar</Text>
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
                    placeholder={inputPlaceholder}
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