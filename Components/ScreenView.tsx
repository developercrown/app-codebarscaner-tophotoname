import { ScrollView, StyleSheet, View } from "react-native";

const screenViewStyles = StyleSheet.create({
    scrollview: {
        flex: 1
    },
    container: {
        flex: 1,
        paddingVertical: 10,
    },
});

const ScreenView = (props: any) => {
    const {children, style} = props;
    return <ScrollView style={[screenViewStyles.scrollview, style ? style : {}]}>
        <View style={screenViewStyles.container}>
            {children}
        </View>
    </ScrollView>
}

export default ScreenView;