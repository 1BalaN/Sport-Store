import React from "react";
import { Modal, Button} from "react-bootstrap";

const DeleteItem = ({show, onHide, onDelete, brandName, devName}) => {

  return (
    <Modal
    show={show}
    onHide={onHide}
    size="md"
    centered
  >
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        Удаление товара
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
        Вы уверены, что хотите удалить товар {brandName} : {devName}
    </Modal.Body>
    <Modal.Footer>
      <Button  variant={'outline-warning'} onClick={onHide}>Отмена</Button>
      <Button  variant={'outline-danger'} onClick={onDelete}>Удалить</Button>
    </Modal.Footer>
  </Modal>
  );
};

export default DeleteItem;