import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "..";
import './brandBar.css';

const BrandBar = observer(() => {
  const { item } = useContext(Context);
  return (
    <div className="brand__list">
      {item.brands.map((brand) => (
        <div className={brand.id === item.selectedBrand.id ? 'brand__card active' : 'brand__card'}
          style={{ cursor: "pointer" }}
          border={brand.id === item.selectedBrand.id ? "success" : "none"}
          onClick={() => item.setSelectedBrand(brand)}
          key={brand.id}
        >
          {brand.name}
        </div>
      ))}
    </div>
  );
});

export default BrandBar;
