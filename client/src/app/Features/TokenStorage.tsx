export function getToken(){
    const token = localStorage.getItem('token')
    return token
}

export function storeToken(token: any){
    localStorage.setItem('token', token)
}

export function destroyToken(){
    localStorage.removeItem('token')
}