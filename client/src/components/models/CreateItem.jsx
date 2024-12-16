import React, { useContext, useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Context } from "../..";
import { createItem, getBrands, getItems, getTypes } from "../../http/itemApi";
import { observer } from "mobx-react-lite";

const CreateItem = observer(({ show, onHide }) => {
  const { item } = useContext(Context);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [file, setFile] = useState(null);
  const [info, setInfo] = useState([]);
  const [error, setError] = useState("");
  const [propertyError, setPropertyError] = useState("");
  const [availability, setAvailability] = useState("в наличии");

  useEffect(() => {
    getTypes().then((data) => item.setTypes(data));
    getBrands().then((data) => item.setBrands(data));
  }, []);

  const addInfo = () => {
    // Проверка на пустые поля при добавлении нового свойства
    const emptyInfoField = info.some((i) => !i.title.trim() || !i.description.trim());

    if (emptyInfoField) {
      setPropertyError("Все поля для свойств должны быть заполнены.");
      return;
    }

    setPropertyError(""); // Очистить ошибку
    setInfo([...info, { title: "", description: "", number: Date.now() }]);
  };

  const removeInfo = (number) => {
    setInfo(info.filter((i) => number !== i.number));
  };

  const selectFile = (e) => {
    setFile(e.target.files[0]);
  };

  const changeInfo = (key, value, number) => {
    setInfo(info.map((i) => (i.number === number ? { ...i, [key]: value } : i)));
  };

  const validateFields = () => {
    if (!name.trim()) {
      setError("Название товара обязательно.");
      return false;
    }
    if (price <= 0) {
      setError("Цена товара должна быть больше 0.");
      return false;
    }
    if (price > 10000) {
      setError("Цена товара не может превышать 10 000.");
      return false;
    }
    if (!file) {
      setError("Изображение товара обязательно.");
      return false;
    }
    if (!item.selectedBrand.id) {
      setError("Выберите бренд товара.");
      return false;
    }
    if (!item.selectedType.id) {
      setError("Выберите категорию товара.");
      return false;
    }
    // Проверка на пустые поля в свойствах
    const emptyInfoField = info.some((i) => !i.title.trim() || !i.description.trim());
    if (emptyInfoField) {
      setError("Все поля для свойств должны быть заполнены.");
      return false;
    }

    setError("");
    return true;
  };

  const addItem = () => {
    if (!validateFields()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", `${price}`);
    formData.append("img", file);
    formData.append("brandId", item.selectedBrand.id);
    formData.append("typeId", item.selectedType.id);
    formData.append("availability", availability); 
    formData.append("info", JSON.stringify(info));

    createItem(formData).then(() => {
      onHide();
      getItems(null, null, 1, 10).then((data) => {
        item.setItems(data.rows);
        item.setTotalCount(data.count);
      });
    });

    item.setSelectedType({});
    item.setSelectedBrand({});
    setName("");
    setPrice(0);
    setFile(null);
    setInfo([]);
  };

  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Добавить новый товар
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {propertyError && <p style={{ color: "red" }}>{propertyError}</p>}
          <Form.Select
            aria-label="Выберите категорию товара"
            onChange={(e) => {
              const selectedType = item.types.find(type => type.id === Number(e.target.value));
              item.setSelectedType(selectedType || {});
            }}
          >
            <option value="">Выберите категорию товара</option>
            {item.types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </Form.Select>

          <Form.Select
            className="mt-3"
            aria-label="Выберите бренд"
            onChange={(e) => {
              const selectedBrand = item.brands.find(brand => brand.id === Number(e.target.value));
              item.setSelectedBrand(selectedBrand || {});
            }}
          >
            <option value="">Выберите бренд</option>
            {item.brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </Form.Select>

          <Form.Control
            required
            value={name}
            className="mt-3"
            placeholder="Введите название товара"
            onChange={(e) => setName(e.target.value)}
          />
          <Form.Control
            value={price}
            className="mt-3"
            placeholder="Введите стоимость товара"
            type="number"
            onChange={(e) => {
              const inputPrice = Number(e.target.value);
              if (inputPrice <= 10000) {
                setPrice(inputPrice);
              } else {
                setError("Цена товара не может превышать 10 000.");
              }
            }}
          />
          <Form.Control onChange={selectFile} className="mt-3" type="file" />
          <Form.Select className="mt-3" value={availability} onChange={(e) => setAvailability(e.target.value)}>
            <option value="в наличии">В наличии</option>
            {/* <option value="нет в наличии">Нет в наличии</option> */}
          </Form.Select>
          <hr />
          <Button variant={"outline-dark"} onClick={addInfo}>
            Добавить новое свойство
          </Button>
          {info.map((i) => (
            <Row key={i.number} className="mt-2">
              <Col md={4}>
                <Form.Control
                  onChange={(e) => changeInfo("title", e.target.value, i.number)}
                  value={i.title}
                  placeholder="Введите название свойства"
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  onChange={(e) => changeInfo("description", e.target.value, i.number)}
                  value={i.description}
                  placeholder="Введите описание свойства"
                />
              </Col>
              <Col md={4}>
                <Button
                  variant="outline-danger"
                  onClick={() => removeInfo(i.number)}
                >
                  Удалить
                </Button>
              </Col>
            </Row>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant={"outline-danger"} onClick={onHide}>
          Закрыть
        </Button>
        <Button variant={"outline-success"} onClick={addItem}>
          Добавить
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default CreateItem;
