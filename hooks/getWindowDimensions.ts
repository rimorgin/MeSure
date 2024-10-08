import React from 'react'
import { useWindowDimensions } from 'react-native'

export function getWindowDimensions() {
    const {height, width} = useWindowDimensions();
    return {height, width};
}

