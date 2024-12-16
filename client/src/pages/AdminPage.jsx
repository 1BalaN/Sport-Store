import React, { useContext, useEffect, useState } from 'react'
import { Button, Container, Spinner } from 'react-bootstrap'
import CreateBrand from '../components/models/CreateBrand'
import CreateItem from '../components/models/CreateItem'
import CreateType from '../components/models/CreateType'
import BrandList from '../components/BrandList'
import ItemList from '../components/ItemList'
import TypeList from '../components/TypeList'
import { getBrands, getItems, getTypes } from '../http/itemApi'
import { exportOrdersToExcel } from '../http/orderApi'
import { observer } from 'mobx-react-lite'
import { Context } from '..'
import DeleteBrand from '../components/models/DeleteBrand'
import DeleteType from '../components/models/DeleteType'
import DeleteUser from '../components/models/DeleteUser'
import UsersList from '../components/UsersList'
import { getUsers } from '../http/userApi'

const AdminPage = observer(() => {
    const {item, user} = useContext(Context)


    useEffect(() => {
        getTypes().then(data => item.setTypes(data))
        getBrands().then(data => item.setBrands(data))
        getItems(null, null, 1, 100).then(data => {
            item.setItems(data.rows)
            item.setTotalCount(data.count)
        })
        getUsers().then((data) => {
            user.setUsers(data.rows)
            console.log(user.users)
          })
    }, [])

    useEffect(() => {
        getItems(item.selectedType.id, item.selectedBrand.id, item.page, 100).then(data => {
            item.setItems(data.rows)
            item.setTotalCount(data.count)
            
        })
    }, [item.page, item.selectedBrand, item.selectedType])

    const [loading, setLoading] = useState(false); 
    const [brandVisible, setBrandVisible] = useState(false)
    const [itemVisible, setItemVisible] = useState(false)
    const [typeVisible, setTypeVisible] = useState(false)
    const [deleteBrandVisible, setDeleteBrandVisible] = useState(false)
    const [deleteTypeVisible, setDeleteTypeVisible] = useState(false)
    const [deleteUserVisible, setDeleteUserVisible] = useState(false)

    
    // Функция экспорта заказов
    const handleExportOrders = async () => {
        try {
            setLoading(true);
            await exportOrdersToExcel();
        } catch (error) {
            console.error('Ошибка при экспорте заказов:', error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Container className='d-flex flex-column'>
            <Button variant={'outline-dark'} className='mt-2 p-2' onClick={() => setTypeVisible(true)}>Добавить категорию</Button>
            <Button variant={'outline-dark'} className='mt-2 p-2' onClick={() => setBrandVisible(true)}>Добавить бренд</Button>
            <Button variant={'outline-dark'} className='mt-2 p-2' onClick={() => setItemVisible(true)}>Добавить товар</Button>

            <Button variant={'outline-primary'} className="mt-3 p-2" onClick={handleExportOrders} disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : 'Экспортировать заказы в Excel'}
            </Button>

            <BrandList/>
            <TypeList/>
            <UsersList/>
            <h2 style={{marginTop:'20px'}}>Все товары</h2>
            <ItemList/>
            <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)}/>
            <CreateType show={typeVisible} onHide={() => setTypeVisible(false)}/>
            <CreateItem show={itemVisible} onHide={() => setItemVisible(false)}/>
            <DeleteBrand show={deleteBrandVisible} onHide={() => setDeleteBrandVisible(false)}/>
            <DeleteType show={deleteTypeVisible} onHide={() => setDeleteTypeVisible(false)} />
            <DeleteUser show={deleteUserVisible} onHide={() => setDeleteUserVisible(false)} />
        </Container>
    )
})

export default AdminPage