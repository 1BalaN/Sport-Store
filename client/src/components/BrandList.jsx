import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Row } from "react-bootstrap";
import { Context } from "..";
import BrandItem from "./BrandItem";

const BrandList = observer(() => {
  const { item } = useContext(Context);
  return (
    <Row className="d-flex mt-2">
      <h2>Бренды</h2>
        {item.brands.map(brand => 
            <BrandItem key={brand.id} brand={brand}/>
            )}
    </Row>
  );
});

export default BrandList;
