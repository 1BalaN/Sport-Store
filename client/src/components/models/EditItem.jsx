import React, { useContext, useEffect, useState } from "react";
import { Modal, Button, Form, FormControl, Row, Col } from "react-bootstrap";
import { Context } from "../..";
import { editItem, getBrands, getItems, getTypes } from "../../http/itemApi";
import { observer } from "mobx-react-lite";

const EditItem = observer(({ show, onHide, devId, devName, devPrice, devAvailability }) => {
  const { item } = useContext(Context);
  const [name, setName] = useState(devName);
  const [price, setPrice] = useState(devPrice);
  const [availability, setAvailability] = useState(devAvailability || "в наличии");
  const [error, setError] = useState("");

  useEffect(() => {
    getTypes().then((data) => item.setTypes(data));
    getBrands().then((data) => item.setBrands(data));
  }, []);

  const validateFields = () => {
    if (price <= 0 || !name.trim() || price > 10000) {
      setError("Поля должны быть заполнены, цена должна быть больше 0 и меньше 10000.");
      return false;
    }
    setError("");
    return true;
  };

  const editItems = (id) => {
    if (!validateFields()) return;

    console.log("Отправка данных на сервер:", { name, price, availability }); // Добавлено логирование

    editItem(id, { name, price, availability }).then((data) => {
      console.log("Ответ от сервера:", data); // Логируем ответ от сервера
      getItems(null, null, 1, 8).then((data) => {
        item.setItems(data.rows);
        item.setTotalCount(data.count);
      });
      onHide();
    }).catch((error) => {
      console.error("Ошибка при обновлении товара:", error); // Логирование ошибки
    });
  };

  const cancelEdit = () => {
    onHide();
    setName(devName);
    setPrice(devPrice);
    setAvailability(devAvailability || "в наличии");
  };

  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Изменение товара</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Form.Label>Название товара</Form.Label>
          <FormControl
            value={name}
            className="mt-3"
            placeholder="Введите новое название товара"
            onChange={(e) => setName(e.target.value)}
          />
          <Form.Label>Цена</Form.Label>
          <Form.Control
            value={price}
            className="mt-3"
            placeholder="Изменить стоимость"
            type="number"
            onChange={(e) => setPrice(Number(e.target.value))}
          />
          <Form.Label>Наличие</Form.Label>
          <Form.Select
            className="mt-3"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            <option value="в наличии">В наличии</option>
            <option value="нет в наличии">Нет в наличии</option>
          </Form.Select>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-warning" onClick={cancelEdit}>
          Отмена
        </Button>
        <Button variant="outline-success" onClick={() => editItems(devId)}>
          Сохранить
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default EditItem;
