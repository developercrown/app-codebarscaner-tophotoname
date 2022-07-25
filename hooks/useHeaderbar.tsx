import { useLayoutEffect, useState } from "react";
import LogoTitle from "../components/LogoTitleHeader";

const useHeaderbar = (props: any) => {
    const {
        hide,
        hideShadow,
        leftSection,
        navigation,
        rightSection,
        transparent,
        style
    } = props;
    useLayoutEffect(() => {
        if(!hide){
            const options = {
                headerTransparent: transparent,
                headerStyle: style,
                headerShadowVisible: hideShadow,
                headerTitle: (props: any) => leftSection ? leftSection : <LogoTitle {...props} />,
                headerRight: () => rightSection ? rightSection : null
            };
            navigation.setOptions(options);
        } else {
            navigation.setOptions({ headerShown: false });
        }
    }, [navigation]);
}

export default useHeaderbar;