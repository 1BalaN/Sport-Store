import { $authHost, $host } from ".";

export const createType = async (type) => {
    const {data} = await $authHost.post('api/type', type)
    return data
}
export const deleteType = async (id) => {
    await $authHost.delete('api/type', {params:{
        id
    }})
}
export const getTypes = async () => {
    const {data} = await $host.get('api/type')
    return data
}

export const createBrand = async (brand) => {
    const {data} = await $authHost.post('api/brand', brand)
    return data
}
export const deleteBrand = async (id) => {
    await $authHost.delete('api/brand', {params:{
         id
     }})
 }
export const getBrands = async () => {
    const {data} = await $host.get('api/brand')
    return data
}

export const createItem = async (item) => {
    const {data} = await $authHost.post('api/item', item)
    return data
}


//Изменение данных о товаре
export const editItem = async(id, {name, price, availability}) => {
    const {data} = await $host.put(`api/item/${id}`, {name, price, availability}, {params:{
        id,    
    }
})
    return data
}

export const getItems = async (typeId, brandId, page, limit = 9, searchQuery = '') => {
    const {data} = await $host.get('api/item', {
        params: {
            typeId: typeId || '',  
            brandId: brandId || '',  
            page,
            limit,
            searchQuery: searchQuery || '' 
        }
    });
    return data;
};

export const getOneItem = async (id) => {
    const {data} = await $host.get('api/item/' + id)
    return data
}

//удаление по id
export const deleteItem = async (id) => {
   await $authHost.delete('api/item', {params:{
        id
    }})
}

