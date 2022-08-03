const useValidate = () => {
    const required = (value: any) => {
        value = (value+'').trim()
        return (
            value !== undefined &&
            value !== null &&
            value !== '' &&
            value.length > 0
        )
    }

    return {required}
}

export default useValidate