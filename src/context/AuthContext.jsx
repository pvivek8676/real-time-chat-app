import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const AuthContext = createContext();

export const useAuth = () =>
  useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] =
  useState(() => {
    const savedUser =
      localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  useEffect(() => {
  if (user?.theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, [user]);

  const login = (
  userData,
  token
) => {
  localStorage.setItem(
    "token",
    token
  );

  localStorage.setItem(
    "user",
    JSON.stringify(userData)
  );

  setUser(userData);
};

  const logout = () => {
  localStorage.removeItem(
    "token"
  );

  localStorage.removeItem(
    "user"
  );

  setUser(null);
};

const updateUser = (updatedUser) => {
  localStorage.setItem(
    "user",
    JSON.stringify(updatedUser)
  );

  setUser(updatedUser);
};

  return (
    <AuthContext.Provider
      value={{
  user,
  login,
  logout,
  updateUser,
}}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;