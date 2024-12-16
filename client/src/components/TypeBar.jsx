import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Button, ListGroup } from "react-bootstrap";
import { Context } from "..";
import "./TypeBar.css";

const TypeBar = observer(({ resetSearch }) => {
  const { item } = useContext(Context);

  const clearFilter = () => {
    item.setSelectedType({});
    item.setSelectedBrand({});
    resetSearch(); // Сбрасываем поисковый запрос
  };

  return (
    <ListGroup
      className="mt-2"
      style={{
        border: "1px solid #ddd",
        // borderRadius: "6px",
      }}
    >
      {item.types.map((type) => (
        <ListGroup.Item
          className="activefilter"
          style={{
            cursor: "pointer",
            transition: "background-color 0.2s ease",
          }}
          active={type.id === item.selectedType.id}
          onClick={() => item.setSelectedType(type)}
          key={type.id}
        >
          {type.name}
        </ListGroup.Item>
      ))}
      <Button
        className="mt-2"
        onClick={clearFilter}
        style={{
          backgroundColor: "#212529",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
        }}
      >
        Сбросить фильтры
      </Button>
    </ListGroup>
  );
});

export default TypeBar;
