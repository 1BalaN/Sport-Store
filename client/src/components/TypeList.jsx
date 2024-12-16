import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Row } from "react-bootstrap";
import { Context } from "..";
import TypeItem from "./TypeItem";

const TypeList = observer(() => {
  const { item } = useContext(Context);
  return (
    <Row className="d-flex mt-2">
      <h2>Категории</h2>
        {item.types.map(type => 
            <TypeItem key={type.id} type={type}/>
            )}
    </Row>
  );
});

export default TypeList;
