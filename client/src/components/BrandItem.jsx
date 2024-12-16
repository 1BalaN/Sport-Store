import React, { useContext, useState } from "react";
import { Button, Row, Col, Alert } from "react-bootstrap";
import { deleteBrand, getBrands } from "../http/itemApi";
import { Context } from "..";
import DeleteBrand from "./models/DeleteBrand";

const BrandItem = ({ brand }) => {
  const {item} = useContext(Context)
  const [visibleDeleteBrand, setVisibleDeleteBrand] = useState(false)
  const [show, setShow] = useState(false)
  const removeBrand = (id) => {
    const isBrand = item.items.find(d => d.brandId === id)
    if(isBrand) {
      setVisibleDeleteBrand(false)
      setShow(true)
      console.log('существуют товары с таким брендом')
    } else {
      console.log('удаляем бренд')
      deleteBrand(id).then((data) => {
        console.log(data);
        getBrands().then((data) => {
          item.setBrands(data);
        });
      });
    }

  }

  return (
    <>
    <Row className="d-flex">
      <Col md={1} className="d-flex mt-2">
      {brand.name}
      </Col>
      <Col md={4}>
        <Button
            onClick={() => setVisibleDeleteBrand(true)}
            variant="danger" 
            className="m-1"
        >
            Удалить
        </Button>
      </Col>
    </Row>
    <DeleteBrand
    show={visibleDeleteBrand}
     brandName={brand.name} 
     onDelete={() => removeBrand(brand.id)}
     onHide={() => setVisibleDeleteBrand(false)}
     />
      {show? (  <Alert variant="danger" onClose={()=>setShow(false)} dismissible>
           <Alert.Heading>STOP STOP STOP!</Alert.Heading>
        <p>
          Вы не можете удалить бренд, пока существует хотя бы один товар с таким брендом
        </p>
     </Alert>):null}
    </>
  );
};

export default BrandItem;
