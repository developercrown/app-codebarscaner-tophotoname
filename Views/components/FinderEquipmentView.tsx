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
import { LoadingPicture } from "../../assets/images";
import ImagenComponent from "../../components/ImagenComponent";

const FinderEquipmentView = (props: any) => {
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
    const [imageTitle, setImageTitle] = useState<string>('');
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

    const addKeys = (sourceRows: Array<any>): Array<any> => {
        const output = sourceRows.map((row, key) => {
            return {
                ...row,
                key,
            }
        })
        return output
    }

    const searchRows = () => {
        setWaitMessage(search === "" ? "Obteniendo información" : "Buscando")
        setWait(true)
        instance.get("/rows?equipment_name=" + search).then((response: any) => {
            const { status } = response;
            const data: PaginatorResponse = response.data;
            if (status === 200) {
                const results = addKeys(data.data);
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
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const EditRow = (rowMap: any, rowKey: any) => {
        console.log('editar');        
        closeRow(rowMap, rowKey);
    };

    const gotoInformation = (data: any) => {
        console.log('data', data);
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
                {/* <View style={{width: 16, height: 16, borderRadius: 8, position: 'absolute', backgroundColor: data.item.review_status ? 'green' : 'red', bottom: 5, right: 5}}></View> */}
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
        <View
            style={[styles.container]}
        >
            <View style={{
                width: "100%",
                height: 70,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#aaa"
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
                height: 40,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                backgroundColor: "#bbb"
            }}>
                <View><Text>Left</Text></View>
                <View><Text>Center</Text></View>
                <View><Text>Right</Text></View>
            </View>
            <View style={{
                width: "100%",
                height: windowHeight - 180,
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
                            renderHiddenItem={renderHiddenItem}
                            leftOpenValue={75}
                            rightOpenValue={-150}
                            previewRowKey={'0'}
                            previewOpenValue={-40}
                            previewOpenDelay={3000}
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