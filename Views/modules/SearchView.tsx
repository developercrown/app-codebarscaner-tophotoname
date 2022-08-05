import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Animated, BackHandler, Dimensions, Modal, StatusBar, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native"
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
    const {navigation} = props;
    const { config } : any = useContext(ConfigContext);
    const { auth, setAuth } : any = useContext(AuthContext);
    const {instance} = useAxios(config.servers.app)
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const sound = useSound();

    const [serverPath, setServerPath] = useState<string>('');
    const [wait, setWait] = useState<boolean>(false);
    const [viewPhotoMode, setViewPhotoMode] = useState<boolean>(false);
    const [photo, setPhoto] = useState<any>(null);

    const [rows, setRows] = useState<any>([
        {
            key: 0,
            name: "uno",
            codebar: "10650149",
            status: "ACTIVO",
        },
        {
            key: 1,
            name: "dos",
            codebar: "10650150",
            status: "BAJA",
        },
        {
            key: 2,
            name: "tres",
            codebar: "10650151",
            status: "ACTIVO",
        }
    ]);

    // const rowSwipeAnimatedValues: any = {};
    // Array(3)
    //     .fill('')
    //     .forEach((_, i) => {
    //         rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
    //     });

    const [search, setSearch] = useState<string>("");
    const searchBoxRef = useRef();
    

    useHeaderbar({ hide: true, navigation });

    const handleBack = () => {
        if(!wait) {
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

    const searchRows = () => {
        setWait(true)
        instance.get("/rows?equipment_name="+search).then((response: any) => {
            const {status} = response;
            const data: PaginatorResponse = response.data;
            if(status === 200){
                const results = data.data;
                if(results.length >= 1){
                    console.log(results);
                    setRows(results)
                    setWait(false)
                    return
                }
                notResultFailback("No se encontraron registros en el sistema");
                return
            }
            notResultFailback("No se pudieron obtener los registros, verifique su información");
        }).catch((err: any) =>{
            notResultFailback("Ocurrio un error al consultar la información, intentelo más tarde.");
        })
    }

    useFocusEffect(
        useCallback(() => {
            if(config.servers.app){
                const rootServer = (config.servers.app + '').split('/api/')
                if(rootServer && rootServer.length > 0){
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
        <StatusBar barStyle="light-content" backgroundColor='rgba(10, 10, 10, 1)'/>
        {
            <InternalHeader title={ "Busqueda de equipos" } leftIcon="chevron-back" leftAction={handleBack} rightAction={handleBack} style={{backgroundColor: 'rgba(0, 0, 0, .5)'}}/>
        }
    </>

    const closeRow = (rowMap: any, rowKey: any) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
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

    const renderHiddenItem = (data: any, rowMap: any) => (
        <View style={styles.rowBack}>
            <Text>Left</Text>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnLeft]}
                onPress={() => closeRow(rowMap, data.item.key)}
            >
                <Text style={colors.dark}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => deleteRow(rowMap, data.item.key)}
            >
                <Animated.View
                    style={[
                        styles.trash,
                        {
                            // transform: [
                            //     {
                            //         scale: rowSwipeAnimatedValues[
                            //             data.item.key
                            //         ].interpolate({
                            //             inputRange: [45, 90],
                            //             outputRange: [0, 1],
                            //             extrapolate: 'clamp',
                            //         }),
                            //     },
                            // ],
                        },
                    ]}
                >
                    <Ionicons name="trash" size={28} style={{ color: 'white' }} />
                </Animated.View>
            </TouchableOpacity>
        </View>
    );

    return <View style={[styles.container]}>
        { header }
        {
            !wait && viewPhotoMode &&  <Modal
                animationType="slide"
                statusBarTranslucent={true}
                hardwareAccelerated={true}
                transparent={false}
                visible={viewPhotoMode}
                onRequestClose={disableAllFullscreenElements}
            > 
                <FullScreenImage image={photo} onBack={()=> setViewPhotoMode(false)}/>
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
                    styleLabel={[ textStyles.shadowLight, colors.white ]}
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
                height: windowHeight-100,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "flex-start",
                paddingTop: 10,
                backgroundColor: "rgba(255, 255, 255, .2)"
            }}>
                {
                    rows && rows.length > 1 ?
                        <SwipeListView
                            data={rows}
                            renderItem={renderItem}
                            renderHiddenItem={renderHiddenItem}
                            leftOpenValue={75}
                            rightOpenValue={-150}
                            previewRowKey={'0'}
                            previewOpenValue={-40}
                            previewOpenDelay={1000}
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