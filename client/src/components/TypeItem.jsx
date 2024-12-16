import React, { useContext, useState } from "react";
import { Button, Row, Col, Alert } from "react-bootstrap";
import { deleteType, getTypes } from "../http/itemApi";
import { Context } from "..";
import DeleteType from "./models/DeleteType";

const TypeItem = ({ type }) => {
  const {item} = useContext(Context)
  const [visibleDeleteType, setVisibleDeleteType] = useState(false)
  const [show, setShow] = useState(false)
  const removeType = (id) => {
    const isType = item.items.find(t => t.typeId === id)
    if(isType) {
      setVisibleDeleteType(false)
      setShow(true)
      console.log('существуют товары такой категории')
    } else {
      console.log('удаляем категорию')
      deleteType(id).then((data) => {
        console.log(data);
        getTypes().then((data) => {
          item.setTypes(data);
        });
      });
    }

  }

  return (
    <>
    <Row className="d-flex">
      <Col md={1} className="d-flex mt-2">
      {type.name}
      </Col>
      <Col md={4}>
        <Button
            onClick={() => setVisibleDeleteType(true)}
            variant="danger" 
            className="m-1"
        >
            Удалить
        </Button>
      </Col>
    </Row>
    <DeleteType
    show={visibleDeleteType}
     typeName={type.name} 
     onDelete={() => removeType(type.id)}
     onHide={() => setVisibleDeleteType(false)}
     />
      {show? (  <Alert variant="danger" onClose={()=>setShow(false)} dismissible>
           <Alert.Heading>STOP STOP STOP!</Alert.Heading>
        <p>
          Вы не можете удалить категорию, пока существует хотя бы один товар с такой категорией
        </p>
     </Alert>):null}
    </>
  );
};

export default TypeItem;
