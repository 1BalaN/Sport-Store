import { makeAutoObservable } from 'mobx';
import { fetchItemAverageRating, fetchUserRating, setRating } from '../http/ratingApi';

export default class ItemStore {
    constructor() {
        this._isLoading = true;
        this._types = [];
        this._brands = [];
        this._items = [];
        this._namesBrands = [];
        this._namesTypes = [];
        this._selectedType = {};
        this._selectedBrand = {};
        this._selectedAvailability = 'в наличии';
        this._page = 1;
        this._totalCount = 0;
        this._limit = 9;
        this._findBrandById = null;
        this._findTypeById = null;
        this._selectedItemId = null; // Выбранный товар
        this._averageRating = null; // Средний рейтинг
        this._userRating = null; // Рейтинг пользователя
        this._ratingError = null; // Ошибка при работе с рейтингом
        makeAutoObservable(this);
    }

    // Новое поле для ошибок
    setRatingError(error) {
        this._ratingError = error;
    }

    clearRatingError() {
        this._ratingError = null;
    }

    // Установить доступность товаров
    setSelectedAvailability(availability) {
        this._selectedAvailability = availability;
        this.setPage(1); // Сбросить страницу при изменении фильтра
    }

    setTypes(types) {
        this._types = types;
    }

    setIsLoading(isLoading) {
        this._isLoading = isLoading;
    }

    setNamesBrands(namesBrands) {
        this._namesBrands = namesBrands;
    }

    setNamesTypes(namesTypes) {
        this._namesTypes = namesTypes;
    }

    setFindBrand(id) {
        this._findBrandById = this._brands?.find(b => b.id === id);
    }

    setFindType(id) {
        this._findTypeById = this._types?.find(t => t.id === id);
    }

    setBrands(brands) {
        this._brands = brands;
    }

    setItems(items) {
        this._items = items;
        this.setIsLoading(false);
    }

    setSelectedType(selectedType) {
        this.setPage(1);
        this._selectedType = selectedType;
    }

    setSelectedBrand(selectedBrand) {
        this._selectedBrand = selectedBrand;
    }

    setPage(page) {
        this._page = page;
    }

    setTotalCount(totalCount) {
        this._totalCount = totalCount;
    }

    setLimit(limit) {
        this._limit = limit;
    }

    // Методы работы с рейтингом
    async fetchItemAverageRating(itemId) {
        try {
            const response = await fetchItemAverageRating(itemId);
            this._averageRating = response.averageRating || 0;
        } catch (error) {
            console.error("Ошибка при получении среднего рейтинга:", error);
        }
    }

    async fetchUserRating(itemId) {
        try {
            const response = await fetchUserRating(itemId);
            this._userRating = response.rating || null;
        } catch (error) {
            console.error("Ошибка при получении оценки пользователя:", error);
        }
    }

    async submitRating(itemId, rate) {
        this.clearRatingError(); // Сбрасываем ошибку перед новой попыткой
        try {
            await setRating(itemId, rate);
            await this.fetchItemAverageRating(itemId); // Обновляем средний рейтинг
            await this.fetchUserRating(itemId); // Обновляем рейтинг пользователя
        } catch (error) {
            console.error("Ошибка при отправке рейтинга:", error);
            if (error.response && error.response.data && error.response.data.message) {
                this.setRatingError(error.response.data.message); // Устанавливаем текст ошибки
            } else {
                this.setRatingError("Не удалось отправить рейтинг. Попробуйте позже.");
            }
        }
    }

    get types() {
        return this._types;
    }

    get isLoading() {
        return this._isLoading;
    }

    get brands() {
        return this._brands;
    }

    get findBrandById() {
        return this._findBrandById;
    }

    get findTypeById() {
        return this._findTypeById;
    }

    get items() {
        return this._items;
    }

    get selectedType() {
        return this._selectedType;
    }

    get selectedBrand() {
        return this._selectedBrand;
    }

    get page() {
        return this._page;
    }

    get totalCount() {
        return this._totalCount;
    }

    get limit() {
        return this._limit;
    }

    get namesBrands() {
        return this._namesBrands;
    }

    get namesTypes() {
        return this._namesTypes;
    }

    get selectedAvailability() {
        return this._selectedAvailability;
    }

    // Геттеры для рейтингов
    get averageRating() {
        return this._averageRating;
    }

    get userRating() {
        return this._userRating;
    }

    get ratingError() {
        return this._ratingError;
    }
}
