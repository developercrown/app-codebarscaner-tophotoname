import { useState } from "react";
import { Image } from "react-native";
import { Image404, LoadingPicture } from "../assets/images";

const ImagenComponent = (props: any) => {
    const {uri, source, style, resizeMode, resizeMethod} = props;
    const [error, setError] = useState<boolean>(false);
    const handleErrorImage = (props: any) => {
        setError(true)
    }

    return !error ? <Image
                        source={
                            uri ?
                            {
                                uri: `${uri}`,
                                scale: 1
                            }: (source ? source : {})
                        }
                        resizeMethod={resizeMethod}
                        resizeMode={resizeMode}
                        defaultSource={LoadingPicture}
                        style={style}
                        onError={handleErrorImage}
                    />
                    :
                    <Image
                        source={ Image404 }
                        resizeMethod={resizeMethod}
                        resizeMode={resizeMode}
                        style={style}
                    />
}

export default ImagenComponent;