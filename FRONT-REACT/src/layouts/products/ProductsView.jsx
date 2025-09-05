import { useProductContext } from "../../context/ProductContext";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { exportToPDF } from "../../utils/ExportToPdf";
import { Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

export default function ProductsView() {
  const { products, deleteProduct, loading, error } = useProductContext();
  const { user } = useContext(AuthContext);

  const handleExport = () => {
    exportToPDF(products, "Productos", ["nombre", "precio"]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Confirma eliminar este producto?")) return;
    try {
      await deleteProduct(id);
      alert("Producto eliminado");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar producto: " + (err?.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <h2>📦 Lista de Productos 📦</h2>

      {user?.rol === "admin" && (
        <Link to="/productos/crear">
          <Button label="Crear nuevo producto" icon="pi pi-plus" className="p-button-rounded p-button-success m-2" />
        </Link>
      )}

      <Link to="/">
        <Button label="Volver al inicio" icon="pi pi-home" className="p-button-rounded p-button-secondary m-2" />
      </Link>

      <Button label="Exportar PDF" icon="pi pi-file-pdf" className="p-button-rounded p-button-warning m-2" onClick={handleExport} />

      {loading && <p>Cargando productos...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <DataTable value={Array.isArray(products) ? products : []} paginator={false} className="p-datatable-sm p-shadow-2 mt-4">
        <Column field="nombre" header="Nombre" />
        <Column field="precio" header="Precio" />

        <Column
          header="Acciones"
          body={(rowData) => (
            <>
              {user?.rol === "admin" ? (
                <>
                  <Link to={`/productos/editar/${rowData.id}`}>
                    <Button label="Editar" icon="pi pi-pencil" className="p-button-rounded p-button-info mr-2" />
                  </Link>
                  <Button label="Eliminar" icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => handleDelete(rowData.id)} />
                </>
              ) : (
                <span style={{ color: "#777" }}>Acciones solo para admin</span>
              )}
            </>
          )}
        />
      </DataTable>
    </div>
  );
}
