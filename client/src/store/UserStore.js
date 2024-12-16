import {makeAutoObservable} from 'mobx'
import { updateUserPhone, deleteUser, checkPhoneUniqueness, getUsers } from '../http/userApi'
export default class UserStore {
    constructor() {
        this._isAuth = false
        this._user = {}
        this._role = null
        this._users = []
        makeAutoObservable(this)
    }
    setUsers(users) {
        if (!Array.isArray(users)) {
            console.error("Передано значение, которое не является массивом:", users);
            return;
        }
        this._users = [...users]; // Копируем массив для предотвращения мутаций
    }
    
    
    setRole(role) {
        this._role = role
    }
    setIsAuth (bool) {
        this._isAuth = bool
    }

    setUser(user) {
        this._user = user
        
    }

    async updateUserPhone(userId, phone) {
        try {
            // Запрос на сервер для обновления номера телефона
            const data = await updateUserPhone(userId, phone);
            
            // Обновляем номер телефона в локальном состоянии
            this._users = this._users.map(user =>
                user.id === userId ? { ...user, phone } : user
            );

            // Если обновляем телефон текущего авторизованного пользователя
            if (this._user.id === userId) {
                this._user.phone = phone;
            }

            return data; // Возвращаем данные, если нужно
        } catch (error) {
            console.error('Ошибка при обновлении телефона:', error);
            throw new Error('Ошибка при обновлении телефона');
        }
    }

    async fetchUsers() {
        try {
            const response = await getUsers(); // Запрос на сервер
            if (response && Array.isArray(response.rows)) {
                this.setUsers(response.rows); // Передаем только массив пользователей
            } else {
                console.error("Ошибка: Неверная структура ответа от сервера", response);
            }
        } catch (error) {
            console.error("Ошибка при загрузке пользователей:", error);
        }
    }
    
    
    

    async deleteUser(userId) {
        try {
            await deleteUser(userId);

            // Обновляем список пользователей после удаления
            await this.fetchUsers();

            // Если удаляется текущий пользователь, сбрасываем состояние
            if (this._user.id === userId) {
                this._isAuth = false;
                this._user = {};
                this._role = null;
            }
        } catch (error) {
            console.error("Ошибка при удалении пользователя:", error);
            throw new Error("Ошибка при удалении пользователя");
        }
    }
    
    

    async checkPhoneUniqueness(phone) {
        try {
            const data = await checkPhoneUniqueness(phone);
            return data.unique;
        } catch (error) {
            console.error('Ошибка при проверке уникальности телефона:', error);
            throw new Error('Ошибка при проверке уникальности телефона');
        }
    }

    get users () {
        return this._users
    }

    get role() {
        return this._role
    }

    get isAuth() {
        return this._isAuth
    }

    get user() {
        return this._user
    }

    
}