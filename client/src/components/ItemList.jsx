import { observer } from "mobx-react-lite";
import React, { useContext} from "react";
import { Context } from "..";
import ItemItem from "./ItemItem";
import '../pages/cards.css';

const ItemList = observer(() => {
  const data = useContext(Context);
  return (
    <div className="cards">
        {data.item.items.map((dev, index) => {
          const brand = data.item.brands.find(b => dev.brandId === b.id)
          return  <ItemItem key={dev.id} dev={dev} index={index} brandId={dev.brandId} brandName={brand}/>
        }
            
            )}
    </div>
  );
});

export default ItemList;
