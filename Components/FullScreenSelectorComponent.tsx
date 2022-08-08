import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, fontStyles, textStyles } from "./Styles";
import Ionicons from '@expo/vector-icons/Ionicons';
import { FlatList } from "react-native";

const Item = (props: any) => {
    const { title, onSelect } = props;
    return <TouchableOpacity
        onPress={(e: any) => { onSelect() }}
        style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            minHeight: 50,
            borderColor: 'rgba(0, 0, 0, .2)',
            borderBottomWidth: 1,
            padding: 10
        }}
    >
        <Ionicons
            name={"chevron-forward-circle"}
            size={24}
            style={[colors.blue, { marginRight: 10 }]}
        />
        <Text style={[fontStyles.nunito, textStyles.sm]}>{title}</Text>
    </TouchableOpacity>

};

const FullScreenSelectorComponent = (props: any) => {
    const { data, icon, onExit, onSelect, title } = props;

    const handleExit = () => {
        if (onExit) {
            onExit();
        }
    };

    const renderItem = (props: any) => {
        const { index, item } = props;
        return <Item key={`option-${index}`} title={item.label} onSelect={() => onSelect(item.payload)} />
    };

    return <Modal
        animationType="slide"
        statusBarTranslucent={true}
        hardwareAccelerated={true}
        transparent={true}
        visible={true}
        onRequestClose={handleExit}
    >
        <View style={styles.container}>
            <Pressable style={styles.separatorContainer} onPress={handleExit} />
            <View style={styles.internalContainer}>
                <View style={{ flexDirection: 'row', paddingHorizontal: 10, height: 32 }}>
                    {icon && <Ionicons name={icon} size={24} style={[colors.black]} />}
                    <Text style={[fontStyles.nunitoBold, textStyles.md, textStyles.alignLeft, { marginHorizontal: 10 }]}>{title}</Text>
                </View>
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, marginTop: 10 }}>
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        // keyExtractor={item => item.index}
                    />
                </View>
            </View>
        </View>

    </Modal>
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    separatorContainer: {
        width: "100%",
        height: "30%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'transparent',
    },
    internalContainer: {
        width: "100%",
        height: "70%",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        backgroundColor: 'white',
        paddingTop: 16,
        paddingBottom: 20,
    }
});

export default FullScreenSelectorComponent;