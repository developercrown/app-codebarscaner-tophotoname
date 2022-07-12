import { useLayoutEffect, useState } from "react";
import LogoTitle from "../Components/LogoTitleHeader";

const useHeaderbar = (props: any) => {
    const { hideShadow, navigation, rightSection, leftSection, style } = props;
    const options = {
        // headerTransparent: true,
        headerStyle: style,
        headerShadowVisible: hideShadow,
        headerTitle: (props: any) => leftSection ? leftSection : <LogoTitle {...props} />,
        headerRight: () => rightSection ? rightSection : null
    };

    useLayoutEffect(() => {
        navigation.setOptions(options);
    }, [navigation]);
}

export default useHeaderbar;