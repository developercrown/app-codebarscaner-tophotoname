import { useState } from "react";
import { Dimensions, Image, Text, TouchableHighlight, StyleSheet, View, StatusBar } from "react-native"
import ImageZoom from 'react-native-image-pan-zoom';
import Ionicons from '@expo/vector-icons/Ionicons';

const FullScreenImage = (props: any) => {
    const { image, onBack, onLongPress, title } = props;
    const [imageSize, setImageSize] = useState<any>({ width: 0, height: 0 });

    const screenWidth = Dimensions.get("window").width
    const screenHeight = Dimensions.get("window").height

    const handleBack = () => {
        if (onBack) {
            onBack();
        }
    }

    const calculateImageSize = (params: any) => {
        const {source} = params.nativeEvent;
        let width = source.width
        let height = source.height

        // If image width is bigger than screen => zoom ratio will be image width
        if (width > screenWidth) {
            const widthPixel = screenWidth / width
            width *= widthPixel
            height *= widthPixel
        }

        // If image height is still bigger than screen => zoom ratio will be image height
        if (height > screenHeight) {
            const HeightPixel = screenHeight / height
            width *= HeightPixel
            height *= HeightPixel
        }
        setImageSize({ height, width });
    }

    return <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {
            image
            &&
            <ImageZoom
                cropWidth={screenWidth}
                cropHeight={screenHeight}
                imageWidth={imageSize.width == 0 ? screenWidth : imageSize.width}
                imageHeight={imageSize.height == 0 ? screenHeight : imageSize.height}
                onDragLeft={handleBack}
                onLongPress={onLongPress}
                useNativeDriver={true}
                maxOverflow={0}
            >
                <Image
                    fadeDuration={150}
                    style={[
                        styles.image
                    ]}
                    source={{
                        uri: image && image.uri ? image.uri : image,
                        scale: 1
                    }}
                    resizeMethod="resize"
                    resizeMode="contain"
                    onLoad={calculateImageSize}
                    // defaultSource={LoadingPicture} // TODO: implemente both properties
                    // onError={handleErrorImage}
                />
            </ImageZoom>
        }
        <View style={[
            styles.header,
            {
                backgroundColor: title ? 'rgba(0, 0, 0, .8)' : 'rgba(0, 0, 0, 0)',
                justifyContent: title ? 'space-between' : 'flex-end',
                elevation: title ? 2 : 0
            }
        ]}>
            { title && <Text style={styles.title}>{title}</Text> }
            <TouchableHighlight onPress={handleBack} style={styles.closeButton}>
                <Ionicons name="close" size={40} style={styles.closeButtonIcon} />
            </TouchableHighlight>
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: '100%',
    },
    header: {
        top: 40,
        position: 'absolute',
        width: '95%',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 4,
        borderRadius: 200,
    },
    title: {
        color: 'white',
        paddingLeft: 20,
        fontWeight: 'bold'
    },
    closeButton: {
        backgroundColor: 'rgba(255, 255, 255, .2)',
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        borderRadius: 25
    },
    closeButtonIcon: {
        color: 'white'
    }
});

export default FullScreenImage;