import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Input from "../common/Input";
import Button from "../common/Button";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (
      !formData.email ||
      !formData.password
    ) {
      alert("All fields required");
      return;
    }

    const response =
      await api.post(
        "/auth/login",
        formData
      );

    const {
      token,
      user,
    } = response.data;

    login(user, token);

    navigate("/chat");
  } catch (error) {
    alert(
      error.response?.data?.message ||
        "Login Failed"
    );
  }
};

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter email"
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter password"
      />

      <Button type="submit">
        Login
      </Button>

      <p className="text-center text-sm">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-blue-600"
        >
          Register
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;