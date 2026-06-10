import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Input from "../common/Input";
import Button from "../common/Button";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function RegisterForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] =
    useState({
      name: "",
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
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      alert("All fields required");
      return;
    }

    const response =
      await api.post(
        "/auth/register",
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
        "Registration Failed"
    );
  }
};

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <Input
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter name"
      />

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
        Register
      </Button>

      <p className="text-center text-sm">
        Already have account?{" "}
        <Link
          to="/login"
          className="text-blue-600"
        >
          Login
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;