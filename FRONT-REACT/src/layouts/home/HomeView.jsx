import { useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { AuthContext } from "../../context/AuthContext"; // <--- ruta corregida

const HomeView = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Bienvenido al CRUD de productos y usuarios</h1>
      <h4>
        (Aplicación fullstack en JavaScript donde el frontend (React) consume los
        datos expuestos por el backend (Express), permitiendo realizar CRUDs completos)
      </h4>

      {user ? (
        <div>
          <Link to="/productos">
            <Button label="Ir a Productos" className="m-2" />
          </Link>

          {user.rol === "admin" && (
            <Link to="/usuarios">
              <Button label="Panel de Usuarios" className="m-2 p-button-warning" />
            </Link>
          )}

          <Button label="Cerrar Sesión" onClick={logout} className="m-2 p-button-danger" />
          <div style={{ marginTop: 10 }}>
            <small>
              Sesión: <strong>{user.nombre}</strong> — <em>{user.rol}</em>
            </small>
          </div>
        </div>
      ) : (
        <div>
          <Link to="/inicio-sesion">
            <Button label="Iniciar sesión" className="m-2" />
          </Link>
          <Link to="/registro">
            <Button label="Registrarse" className="m-2 p-button-success" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomeView;
