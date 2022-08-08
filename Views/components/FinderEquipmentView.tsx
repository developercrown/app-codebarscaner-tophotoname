import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, BackHandler, Dimensions, Image, Modal, StatusBar, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native"
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

const availableFilters = [
    {
        label: 'Nombre del equipo',
        payload: {
            placeholder: 'Ingresa el nombre del equipo',
            filter: 'equipment_name'
        }
    },
    {
        label: 'Código de barras',
        payload: {
            placeholder: 'Ingresa el código de barras del equipo',
            filter: 'codebar'
        }
    },
    {
        label: 'Ubicación',
        payload: {
            placeholder: 'Ingresa la ubicación del equipo',
            filter: 'location'
        }
    },
    {
        label: 'Modelo',
        payload: {
            placeholder: 'Ingresa el modelo del equipo',
            filter: 'model'
        }
    },
    {
        label: 'Marca',
        payload: {
            placeholder: 'Ingresa la marca del equipo',
            filter: 'trademark'
        }
    },
    {
        label: 'Persona Resguardante',
        payload: {
            placeholder: 'Ingresa el nombre del resguardante',
            filter: 'safeguard_person'
        }
    },
    {
        label: 'Departamento Resguardante',
        payload: {
            placeholder: 'Ingresa el departamento resguardante',
            filter: 'safeguard_apartment'
        }
    },
    {
        label: 'Series/Códigos Adicionales',
        payload: {
            placeholder: 'Ingresa la información',
            filter: 'series'
        }
    }
]

const FinderEquipmentView = (props: any) => {
    const { navigation } = props;
    const { config }: any = useContext(ConfigContext);
    const { auth, setAuth }: any = useContext(AuthContext);
    const { instance } = useAxios(config.servers.app);

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const sound = useSound();

    const [serverPath, setServerPath] = useState<string>('');
    const [wait, setWait] = useState<boolean>(false);
    const [waitMessage, setWaitMessage] = useState<string>("");
    const [viewPhotoMode, setViewPhotoMode] = useState<boolean>(false);
    const [viewFilterChooserMode, setViewFilterChooserMode] = useState<boolean>(false);
    const [photo, setPhoto] = useState<any>(null);
    const [imageTitle, setImageTitle] = useState<string>('');

    const [inputPlaceholder, setInputPlaceholder] = useState<string>('');
    const [filter, setFilter] = useState<string>('');

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
        disableAllFullscreenElements()
        setCurrentFilter(results)
    }

    const setCurrentFilter = (data: any) => {
        setInputPlaceholder(data.placeholder)
        setFilter(data.filter)
    }
    

    const disableAllFullscreenElements = () => {
        setViewPhotoMode(false)
        setViewFilterChooserMode(false)
    }

    const notResultFailback = (message: string) => {
        alert(message)
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
            if(search === ""){
                message = "Obteniendo información";
            } else {
                message = "Buscando";
            }
        }

        setWaitMessage(message)
        setWait(true)
        instance.get(`/rows?page=${page}&${filter}=${search}`).then((response: any) => {
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
                    
                    if(page===1){
                        results = addKeys(results)
                        setRows(results)
                    } else if(page>= 2){
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
            }
            notResultFailback("No se pudieron obtener los registros, verifique su información");
        }).catch((err: any) => {
            notResultFailback("Ocurrio un error al consultar la información, intentelo más tarde.");
        })
    }

    const handleEndReached = (props: any) => {
        searchRows(pageProps.currentPage+1)
    }

    useFocusEffect(
        useCallback(() => {
            if (config.servers.app) {
                const rootServer = (config.servers.app + '').split('/api/')
                if (rootServer && rootServer.length > 0) {
                    setServerPath(rootServer[0])
                    if(!filter || filter === ''){
                        
                        setCurrentFilter(availableFilters[0].payload)
                    }
                    if(!rows || rows.length === 0) {
                        searchRows()
                    }
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

    const header = <>
        <StatusBar barStyle="light-content" backgroundColor='rgba(10, 10, 10, 1)' />
        {
            <InternalHeader title={"Busqueda de equipos"} leftIcon="chevron-back" leftAction={handleBack} rightIcon="refresh-circle-outline" rightAction={searchRows} style={{ backgroundColor: 'rgba(0, 0, 0, .5)' }} />
        }
    </>

    const closeRow = (rowMap: any, rowKey: any) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const EditRow = (rowMap: any, rowKey: any) => {
        console.log('editar');        
        closeRow(rowMap, rowKey);
    };

    const gotoInformation = (data: any) => {
        // console.log('data', data);
        sound.drop()
        navigation.navigate(
            "EquipmentInformation",
            {
                code: data.codebar
            }
        );
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
                    <TouchableOpacity
                        onPress={() => {
                            sound.echo()
                            setImageTitle(`${data.item.codebar}: ${data.item.equipment_name}`)
                            setPhoto(`${serverPath}/pictures/full/${data.item.picture}`)
                            setViewPhotoMode(true)
                        }}
                        style={{elevation: 1}}
                    >
                        <ImagenComponent
                            uri={`${serverPath}/pictures/thumbs/${data.item.picture}`}
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 20,
                                backgroundColor: '#333'
                            }}
                        />
                    </TouchableOpacity>
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

    const renderHiddenItem = (data: any, rowMap: any) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={[]}
                onPress={() => closeRow(rowMap, data.item.key)}
            >
                <Text style={colors.black}>Clonar</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnLeft]}
                onPress={() => closeRow(rowMap, data.item.key)}
            >
                <Text style={colors.dark}>Cerrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => EditRow(rowMap, data.item.key)}
            >
                <Text style={colors.dark}>Editar</Text>
            </TouchableOpacity>
        </View>
    );

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
            !wait && viewPhotoMode && <Modal
                animationType="slide"
                statusBarTranslucent={true}
                hardwareAccelerated={true}
                transparent={false}
                visible={viewPhotoMode}
                onRequestClose={disableAllFullscreenElements}
            >
                <FullScreenImage image={photo} title={imageTitle} onBack={() => setViewPhotoMode(false)} />
            </Modal>
        }

        {
            !wait &&
            !viewPhotoMode &&
            viewFilterChooserMode &&
            <FullScreenSelectorComponent
                icon="filter"
                data={availableFilters}
                title={"Selecciona el filtro de busqueda"}
                onExit={() => { setViewFilterChooserMode(false); sound.back(); }}
                onSelect={handleFilterSelected}
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
                    styleContainer={[{ width: '85%', paddingHorizontal: 8}]}
                    placeholder={inputPlaceholder}
                    ref={searchBoxRef}
                    onChange={setSearch}
                    actionLeftIcon={() => searchRows()}
                    onSubmit={() => searchRows()}
                    value={search}
                />
                <TouchableOpacity style={{right: 4}}  onPress={() => {setViewFilterChooserMode(true); sound.touch();}}>
                    <Ionicons name={"filter"} size={24} style={[colors.dark]} />
                </TouchableOpacity>
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
                alignItems: "center",
                paddingTop: 0,
                margin: 'auto',
                backgroundColor: "rgba(255, 255, 255, 0)"
            }}>
                {
                    rows && rows.length > 1 ?
                        <SwipeListView
                            ref={listRef}
                            data={rows}
                            renderItem={renderItem}
                            // renderHiddenItem={renderHiddenItem}
                            leftOpenValue={75}
                            rightOpenValue={-150}
                            previewRowKey={'0'}
                            previewOpenValue={-40}
                            previewOpenDelay={3000}
                            onEndReached={handleEndReached}
                        />
                        :
                        <Text>Sin registros</Text>
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
        right: 0,
    },
    trash: {
        height: 25,
        width: 25,
    },
});

export default FinderEquipmentView;