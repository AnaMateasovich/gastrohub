import React from "react";
import { getEmployeeList } from "@/src/lib/employee";
import EmployeeList from "./EmployeeList";

const page = async () => {
  const employee = await getEmployeeList();

  return (
  <EmployeeList employees={employee}/>
  );
};

export default page;
