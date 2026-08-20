import React from "react";
import AdminList from "../../components/AdminListCard";
import { getSupplierList } from "@/src/lib/supplier";
import SuppliersList from "./SuppliersList";

const page = async () => {
  const suppliers = await getSupplierList();

  return (
  <SuppliersList suppliers={suppliers}/>
  );
};

export default page;
