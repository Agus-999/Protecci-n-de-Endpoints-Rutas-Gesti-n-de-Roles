import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // depende de la versión


const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  axios.defaults.baseURL = API_BASE;

  // Decodifica el JWT y verifica expiración
  const decodeUser = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (!decoded.exp || decoded.exp * 1000 < Date.now()) return null;
      const u = decoded.user || decoded;
      return { id: u.id, nombre: u.nombre, email: u.email, edad: u.edad, rol: u.rol };
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const loggedUser = decodeUser(token);
    if (loggedUser) {
      setUser(loggedUser);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post("/auth/login", credentials);
      const token = response.data.token;
      if (!token) {
        alert("No se recibió token");
        return false;
      }

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const loggedUser = decodeUser(token);
      if (!loggedUser) {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        alert("Token inválido o expirado");
        return false;
      }

      setUser(loggedUser);
      navigate("/");
      return true;
    } catch (error) {
      alert(error?.response?.data?.message || "Error al iniciar sesión");
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post("/auth/register", userData);
      if (response.status === 201) {
        alert("Usuario creado exitosamente");
        navigate("/inicio-sesion");
        return true;
      }
      alert(response?.data?.message || "Error al registrar");
      return false;
    } catch (error) {
      alert(error?.response?.data?.message || "Error al registrar");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/inicio-sesion");
  };

  const isAdmin = () => user?.rol === "admin";

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
