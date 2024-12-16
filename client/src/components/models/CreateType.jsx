import React, { useContext, useState } from "react";
import { Modal, Button, Form, FormControl} from "react-bootstrap";
import { createType, getTypes } from "../../http/itemApi";
import { Context } from "../..";

const CreateType = ({show, onHide}) => {
    const {item} = useContext(Context)
    const [value, setValue] = useState('')

    const addType = () => {
        createType({name:value}).then(data =>  {
          getTypes().then(data => item.setTypes(data))
            setValue('')
            onHide()
        })
    }


  return (
    <Modal
    show={show}
    onHide={onHide}
    size="md"
    centered
  >
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        Добавить новую категорию
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form>
            <FormControl value={value} onChange={e => setValue(e.target.value)} placeholder='Введите название категории'/>
        </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button  variant={'outline-danger'} onClick={onHide}>Закрыть</Button>
      <Button  variant={'outline-success'} onClick={addType}>Добавить</Button>
    </Modal.Footer>
  </Modal>
  );
};

export default CreateType;