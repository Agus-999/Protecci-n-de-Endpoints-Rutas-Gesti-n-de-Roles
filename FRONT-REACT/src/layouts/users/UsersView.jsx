import { useUserContext } from "../../context/UserContext";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { exportToPDF } from "../../utils/ExportToPdf";
import { Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

export default function UsersView() {
  const { users, deleteUser, updateUserRole, loading, error } = useUserContext();
  const { user } = useContext(AuthContext);

  const [localUsers, setLocalUsers] = useState([]);

  // Sincronizar localUsers con users del contexto
  useEffect(() => {
    if (Array.isArray(users)) {
      setLocalUsers(users);
    }
  }, [users]);

  const handleExport = () =>
    exportToPDF(localUsers, "Usuarios", ["nombre", "email", "edad", "rol"]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Confirma eliminar este usuario?")) return;
    try {
      await deleteUser(id);
      alert("Usuario eliminado");
      setLocalUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      alert(
        "Error al eliminar usuario: " +
          (err?.response?.data?.message || err.message)
      );
    }
  };

  const roleOptions = [
    { label: "Admin", value: "admin" },
    { label: "Cliente", value: "cliente" },
  ];

  return (
    <div>
      <h2>👤 Lista de Usuarios 👤</h2>

      {user?.rol === "admin" && (
        <Link to="/usuarios/crear">
          <Button
            label="Crear nuevo usuario"
            icon="pi pi-plus"
            className="p-button-rounded p-button-success m-2"
          />
        </Link>
      )}
      <Link to="/">
        <Button
          label="Volver al inicio"
          icon="pi pi-home"
          className="p-button-rounded p-button-secondary m-2"
        />
      </Link>
      <Button
        label="Exportar PDF"
        icon="pi pi-file-pdf"
        className="p-button-rounded p-button-warning m-2"
        onClick={handleExport}
      />

      {loading && <p>Cargando usuarios...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <DataTable
        value={localUsers}
        paginator={false}
        className="p-datatable-sm p-shadow-2 mt-4"
      >
        <Column field="nombre" header="Nombre" />
        <Column field="email" header="Email" />
        <Column field="edad" header="Edad" />
        <Column field="rol" header="Rol" />
        {user?.rol === "admin" && (
          <Column
            header="Gestión de Rol"
            body={(rowData) => <RoleDropdown rowData={rowData} updateUserRole={updateUserRole} setLocalUsers={setLocalUsers} roleOptions={roleOptions} />}
          />
        )}
        <Column
          header="Acciones"
          body={(rowData) =>
            user?.rol === "admin" ? (
              <>
                <Link to={`/usuarios/editar/${rowData.id}`}>
                  <Button
                    label="Editar"
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-info mr-2"
                  />
                </Link>
                <Button
                  label="Eliminar"
                  icon="pi pi-trash"
                  className="p-button-rounded p-button-danger"
                  onClick={() => handleDelete(rowData.id)}
                />
              </>
            ) : (
              <span style={{ color: "#777" }}>Sin permisos</span>
            )
          }
        />
      </DataTable>
    </div>
  );
}

// Componente separado para el dropdown de rol
function RoleDropdown({ rowData, updateUserRole, setLocalUsers, roleOptions }) {
  const [selectedRole, setSelectedRole] = useState(rowData.rol);

  const saveRole = async () => {
    if (!selectedRole) return alert("Seleccione un rol antes de guardar");
    try {
      await updateUserRole(rowData.id, selectedRole);
      alert("Rol actualizado correctamente");
      // Actualizar localUsers para reflejar cambio
      setLocalUsers(prev =>
        prev.map(u => (u.id === rowData.id ? { ...u, rol: selectedRole } : u))
      );
    } catch (err) {
      alert("Error al actualizar rol: " + (err?.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Dropdown
        value={selectedRole}
        options={roleOptions}
        optionLabel="label"
        optionValue="value"
        onChange={(e) => setSelectedRole(e.value)}
        placeholder="Seleccione rol"
        style={{ minWidth: "100px" }}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        className="p-button-rounded p-button-success"
        onClick={saveRole}
      />
    </div>
  );
}
