import Image from "next/image";
import React from "react";

type PopularProductsCardProps = {
  imageSrc: string;
  name: string;
};

const PopularProductsCard = ({
  imageSrc,
  name,
}: PopularProductsCardProps) => {
  return (
    <div className="w-[170px] rounded-2xl overflow-hidden shadow-md bg-white flex-shrink-0">
      <div className="relative w-full h-[140px]">
        <Image
          src={imageSrc ?? '/no-image.png'}
          alt={name}
          fill
          className="object-cover"
          sizes="160px"
        />
      </div>
      <div className="p-2">
        <h3 className="text-sm font-semibold truncate">{name}</h3>
      </div>
    </div>
  );
};

export default PopularProductsCard;
