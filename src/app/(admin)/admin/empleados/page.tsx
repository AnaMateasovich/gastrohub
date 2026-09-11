import { FilterStatusEmployee, getEmployeeList } from "@/src/lib/employee/employee";
import EmployeeList from "./EmployeeList";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ status: FilterStatusEmployee }>;
}) => {
  const {status = "CURRENT"} = await searchParams
  
  const employees = await getEmployeeList({status});

  return <EmployeeList employees={employees} currentStatus={status}/>;
};

export default page;
