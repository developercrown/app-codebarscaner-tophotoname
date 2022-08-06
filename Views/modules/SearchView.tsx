import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, BackHandler, Dimensions, Modal, StatusBar, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native"
import { SwipeListView } from "react-native-swipe-list-view";
import { Input } from "../../components/FormComponents";
import FullScreenImage from "../../components/FullScreenImage";
import InternalHeader from "../../components/InternalHeader";
import ScreenView from "../../components/ScreenView";
import { colors, textStyles } from "../../components/Styles";
import AuthContext from "../../context/AuthProvider";
import ConfigContext from "../../context/ConfigProvider";
import useAxios from "../../hooks/useAxios";
import useHeaderbar from "../../hooks/useHeaderbar";
import useSound from "../../hooks/useSound";
import Ionicons from '@expo/vector-icons/Ionicons';
import PaginatorResponse from "../../models/PaginatorResponse";

const SearchView = (props: any) => {
    const { navigation } = props;
    const { config }: any = useContext(ConfigContext);
    const { auth, setAuth }: any = useContext(AuthContext);
    const { instance } = useAxios(config.servers.app)
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const sound = useSound();

    const [serverPath, setServerPath] = useState<string>('');
    const [wait, setWait] = useState<boolean>(false);
    const [waitMessage, setWaitMessage] = useState<string>("");
    const [viewPhotoMode, setViewPhotoMode] = useState<boolean>(false);
    const [photo, setPhoto] = useState<any>(null);

    const [rows, setRows] = useState<any>([]);

    const [search, setSearch] = useState<string>("");
    const searchBoxRef = useRef();
    const listRef = useRef<any>();


    useHeaderbar({ hide: true, navigation });

    const handleBack = () => {
        if (!wait) {
            sound.back();
            // navigation.navigate(sourcePath, {code});
            return
        }
        sound.touch();
    }

    const disableAllFullscreenElements = () => {
        setViewPhotoMode(false)
    }

    const notResultFailback = (message: string) => {
        alert(message)
        setRows([])
        setWait(false)
    }

    const setData = (data: any) => {
        setRows(data)
        setWait(false)
    }

    const onRowDidOpen = (rowKey: any) => {
        // console.log('This row opened', rowKey);
    };

    const onSwipeValueChange = (swipeData: any) => {
        const { key, value } = swipeData;
        // console.log(key);
        
        // rowSwipeAnimatedValues[key].setValue(Math.abs(value));
    };

    const searchRows = () => {
        setWaitMessage(search === "" ? "Obteniendo información" : "Buscando")
        setWait(true)
        instance.get("/rows?equipment_name=" + search).then((response: any) => {
            const { status } = response;
            const data: PaginatorResponse = response.data;
            if (status === 200) {
                const results = data.data;
                // console.log(data);
                if (results.length >= 1) {
                    setData(results)
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
            <InternalHeader title={"Busqueda de equipos"} leftIcon="chevron-back" leftAction={handleBack} rightAction={handleBack} style={{ backgroundColor: 'rgba(0, 0, 0, .5)' }} />
        }
    </>

    const closeRow = (rowMap: any, rowKey: any) => {
        console.log('rm', rowMap);
        
        
        // if (listRef[rowKey]) {
        //     listRef[rowKey].closeRow();
        // }


        // console.log(listRef);
        
    };

    const deleteRow = (rowMap: any, rowKey: any) => {
        closeRow(rowMap, rowKey);
        // const newData = [...listData];
        // const prevIndex = listData.findIndex(item => item.key === rowKey);
        // newData.splice(prevIndex, 1);
        // setListData(newData);
    };

    const renderItem = (data: any) => {
        // console.log(data);

        return <TouchableHighlight
            onPress={() => console.log('You touched me')}
            style={styles.rowFront}
            underlayColor={'#AAA'}
        >
            <View>
                <Text>{data.item.equipment_name}</Text>
            </View>
        </TouchableHighlight>
    };

    const renderHiddenItem = (data: any, rowMap: any) => {
        // console.log('init', data, data.index);
        // console.log('extra', rowSwipeAnimatedValues[data.index]);
        console.log(data, rowMap[0]);
        

        return <View style={styles.rowBack}>
            <Text>Left</Text>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnLeft]}
                onPress={() => closeRow(rowMap, data.index)}
            >
                <Text style={colors.dark}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => deleteRow(rowMap, data.index)}
            >
                <Animated.View
                    style={[
                        styles.trash
                    ]}
                >
                    <Ionicons name="trash" size={28} style={{ color: 'white' }} />
                </Animated.View>
            </TouchableOpacity>
        </View>
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
            !wait && viewPhotoMode && <Modal
                animationType="slide"
                statusBarTranslucent={true}
                hardwareAccelerated={true}
                transparent={false}
                visible={viewPhotoMode}
                onRequestClose={disableAllFullscreenElements}
            >
                <FullScreenImage image={photo} onBack={() => setViewPhotoMode(false)} />
            </Modal>
        }
        <View
            style={[styles.container]}
        >
            <View style={{
                width: "100%",
                height: 70,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, .3)"
            }}>
                <Input
                    icon="search"
                    styleLabel={[textStyles.shadowLight, colors.white]}
                    styleInput={[{ padding: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)' }]}
                    placeholder="Ingresa el nombre del equipo"
                    ref={searchBoxRef}
                    onChange={setSearch}
                    onSubmit={() => searchRows()}
                    value={search}
                />
            </View>
            <View style={{
                width: "100%",
                height: 30,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, .3)"
            }}>
                <View><Text>Left</Text></View>
                <View><Text>Center</Text></View>
                <View><Text>Right</Text></View>
            </View>
            <View style={{
                width: "100%",
                height: windowHeight - 100,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "flex-start",
                paddingTop: 10,
                backgroundColor: "rgba(255, 255, 255, .2)"
            }}>
                {
                    rows && rows.length > 1 ?
                        <SwipeListView
                            ref={listRef}
                            data={rows}
                            renderItem={renderItem}
                            renderHiddenItem={renderHiddenItem}
                            leftOpenValue={75}
                            rightOpenValue={-150}
                            previewRowKey={'0'}
                            previewOpenValue={-40}
                            previewOpenDelay={1000}
                            onRowDidOpen={onRowDidOpen}
                            onSwipeValueChange={onSwipeValueChange}
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
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
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
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
    trash: {
        height: 25,
        width: 25,
    },
});

export default SearchView;