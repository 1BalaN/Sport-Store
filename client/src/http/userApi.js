import { $authHost, $host } from ".";
import { jwtDecode } from 'jwt-decode'

export const registration = async (email, password) => {
    const {data} = await $host.post('api/user/registration', {email, password, role:'USER'})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}
export const login = async (email, password) => {
    const {data} = await $host.post('api/user/login', {email, password})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const getUsers = async () => {
    const {data} = await $authHost.get('api/user')
    return data
}
export const check = async () => {
    try{
        const {data} = await $authHost.get('api/user/auth')
        localStorage.setItem('token', data.token)
        return jwtDecode(data.token) 
    } catch (e) {
        console.log(e.message, 'Ошибка')
    }

}

export const deleteUser = async (userId) => {
    const { data } = await $authHost.delete(`api/user/${userId}`);
    return data;
};

export const updateUserPhone = async (userId, phone) => {
    const { data } = await $authHost.put(`api/user/${userId}/phone`, { phone });
    return data;
}

export const checkPhoneUniqueness = async (phone) => {
    const { data } = await $authHost.get('api/user/check-phone', { params: { phone } });
    return data;
};

export const getUserInfo = async (userId) => {
    const { data } = await $authHost.get(`api/user/user-info/${userId}`);
    return data;
}