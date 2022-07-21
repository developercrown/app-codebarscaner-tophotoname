import { Image, View } from "react-native"

const FullScreenImage = (props: any) => {
    const {image} = props;
    return <View style={{
        width: '100%',
        height: '100%'
    }}>
        {
            image && <Image
                source={{ uri: image && image.uri }}
                style={{
                    flex: 1
                }}
            />
        }
    </View>
}

export default FullScreenImage;