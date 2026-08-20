"use client";
import { useState, useTransition } from "react";
import { createEmployeeRole } from "@/src/lib/actions/employee-role.action";
import { toast } from "sonner";
import { EmployeeRole } from "@prisma/client";

type Props = {
  roles: EmployeeRole[];
  value?: string;
  onChange: (roleId: string) => void;
};

const RoleSelect = ({ roles: initialRoles, value, onChange }: Props) => {
  const [roles, setRoles] = useState(initialRoles);
  const [isCreating, setIsCreating] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    if (!newRoleName.trim()) return;

    startTransition(async () => {
      try {
        const role = await createEmployeeRole({ name: newRoleName.trim() });
        setRoles((prev) => [...prev, role].sort((a, b) => a.name.localeCompare(b.name)));
        onChange(role.id);
        setNewRoleName("");
        setIsCreating(false);
        toast.success("Rol creado");
      } catch {
        toast.error("Ese rol ya existe o hubo un error");
      }
    });
  };

  if (isCreating) {
    return (
      <div className="flex gap-1">
        <input
          autoFocus
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          placeholder="Nombre del nuevo rol"
          className="border rounded-md px-3 py-2 text-sm flex-1"
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleCreate())}
        />
        <button
          type="button"
          onClick={handleCreate}
          disabled={isPending}
          className="text-sm px-2 border rounded-md"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={() => setIsCreating(false)}
          className="text-sm px-2 text-gray-500"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <select
      value={value ?? ""}
      onChange={(e) => {
        if (e.target.value === "__new__") {
          setIsCreating(true);
          return;
        }
        onChange(e.target.value);
      }}
      className="border rounded-md px-3 py-2 text-sm"
    >
      <option value="">Sin especificar</option>
      {roles.map((r) => (
        <option key={r.id} value={r.id}>
          {r.name}
        </option>
      ))}
      <option value="__new__">+ Crear nuevo rol</option>
    </select>
  );
};

export default RoleSelect;