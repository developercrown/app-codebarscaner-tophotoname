import { ScrollView, StyleSheet, View } from "react-native";

const screenViewStyles = StyleSheet.create({
    scrollview: {
        flex: 1
    },
    container: {
        flex: 1,
        padding: 0,
    },
});

const ScreenView = (props: any) => {
    const {children, style, styleContainer, refreshControl} = props;
    return <View style={[screenViewStyles.scrollview, style]}>
        <ScrollView refreshControl={refreshControl ? refreshControl : null}>
            <View style={[screenViewStyles.container, styleContainer]}>
                {children}
            </View>
        </ScrollView>
    </View>
}

export default ScreenView;