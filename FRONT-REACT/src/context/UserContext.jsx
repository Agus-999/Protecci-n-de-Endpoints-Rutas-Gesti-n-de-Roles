import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const UserContext = createContext();
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const UserProvider = ({ children }) => {
  const { user: authUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  axios.defaults.baseURL = API_BASE;

  const getUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/usuarios");
      setUsers(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (newUser) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/usuarios", newUser);
      setUsers((prev) => [...prev, data.data || data]);
      return data.data || data;
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const editUser = async (id, updated) => {
    setLoading(true);
    try {
      const { data } = await axios.put(`/usuarios/${id}`, updated);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data.data } : u)));
      return data.data || updated;
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`/usuarios/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      return true;
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
      throw e;
    }
  };

  const updateUserRole = async (id, rol) => {
    setLoading(true);
    try {
      const { data } = await axios.put(`/usuarios/${id}/rol`, { rol });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data.data } : u)));
      return data.data;
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getUsers(); }, []);

  return (
    <UserContext.Provider value={{ users, loading, error, getUsers, addUser, editUser, deleteUser, updateUserRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
