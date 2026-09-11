import UsersList from "./UsersList";
import { getUsersAdmin } from "@/src/lib/users";

const page = async () => {
  
  const users = await getUsersAdmin();

  return <UsersList users={users} />;
};

export default page;
