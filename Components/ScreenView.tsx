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
    const {children, style, styleContainer} = props;
    return <View style={[screenViewStyles.scrollview, style]}>
        <ScrollView>
            <View style={[screenViewStyles.container, styleContainer]}>
                {children}
            </View>
        </ScrollView>
    </View>
}

export default ScreenView;