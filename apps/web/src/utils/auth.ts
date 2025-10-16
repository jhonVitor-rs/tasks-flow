const ACCESS_TOKEN_KEY = 'access_token'

export const getToken = () => sessionStorage.getItem(ACCESS_TOKEN_KEY)

export const setToken = (token: string) => sessionStorage.setItem(ACCESS_TOKEN_KEY, token)

export const clearToken = () => sessionStorage.removeItem(ACCESS_TOKEN_KEY)
