"use client";
import { ProductType } from "../../types/product.type";
import PopularProductsCard from "../components/PopularProductsCard";

type Props = {
  products: ProductType[]
}
const PopularProdList = ({products}: Props) => {

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide">
      {products.map((product) => (
        <div key={product.id}>
          <PopularProductsCard
            imageSrc={product.images[0].url}
            name={product.name}
          />
        </div>
      ))}
    </div>
  );
};

export default PopularProdList;
