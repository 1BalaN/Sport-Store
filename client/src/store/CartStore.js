import {makeAutoObservable} from 'mobx'

export default class CartStore {
    constructor() {
        this._cart = []
        this._quantityCartItems = 0

        makeAutoObservable(this)
    }

    setQuantityCartItems () {
        this._quantityCartItems = this._cart?.reduce((s, i) => s = s + i.quantity, 0)
    }
    
    setCart (items) {
        this._cart = items
    }

    addOne (item) {
        this._cart.push(item)
    }

    removeOne(id) {
       this._cart = this._cart.filter(i => i.id !== id)
    }

    clearCart() {
        this._cart = []
    }

    increaseQuantity(id) {
    const index = this._cart.findIndex(item => item.id === id)
    this._cart[index].quantity ++  
    }

    decreaseQuantity(id) {
        const index = this._cart.findIndex(item => item.id === id)
        this._cart[index].quantity --  
        }


    get cart() {
        return this._cart
    }

    get quantityCartItems () {
        return this._quantityCartItems
    }

    getTotalPrice() {
        return this._cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }
}