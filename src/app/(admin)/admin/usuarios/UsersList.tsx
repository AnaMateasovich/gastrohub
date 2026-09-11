"use client";
import AdminListCard from "../../components/AdminListCard";
import { useRouter } from "next/navigation";
import BackButton from "@/src/app/(main)/components/BackButton";
import Link from "next/link";
import { toast } from "sonner";
import { refresh } from "next/cache";
import { desactivateEmployee } from "@/src/lib/employee/employee.action";
import { FilterStatusEmployee } from "@/src/lib/employee/employee";
import { inviteEmployee } from "@/src/lib/employee/inviteEmployee.action";
import { Membership, Role, User } from "@prisma/client";
import { UserWithMembership } from "@/src/lib/users";
import { formatDate } from "@/src/utils/date.utils";

type Props = {
  users: UserWithMembership[];
};
const UsersList = ({ users }: Props) => {
  const router = useRouter();

  return (
    <div className="">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <BackButton url="/admin/menu" />
          <h1 className="text-xl font-bold">Usuarios</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => {
          const createdAtFormat = formatDate(user.memberships[0].createdAt);

          return (
            <AdminListCard
              key={user.id}
              item={user}
              testId="employee"
              title={(user) => user.name}
              badge={(user) => user.email}
              status={(user) =>
                user.memberships[0].status === "ACTIVE"
                  ? { label: "Activo", variant: "success" }
                  : { label: "Inactivo", variant: "neutral" }
              }
              fields={[
                {
                  key: "createdAt",
                  label: "Creado",
                  render: (user) => String(createdAtFormat),
                },
                {
                  key: "role",
                  label: "Rol",
                  render: (user) => user.memberships[0].role,
                },
              ]}
            />
          );
        })}
      </div>
    </div>
  );
};

export default UsersList;
