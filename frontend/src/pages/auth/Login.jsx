import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const Login = () => {
  const navigate = useNavigate();

  const {
    login,
    isAuthenticated,
    isLoading,
  } = useAuthStore();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!form.email || !form.password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    try {
      await login(
        form.email,
        form.password
      );

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form onSubmit={handleSubmit}>
        <h1>Login Admin RJI</h1>

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        <div>
          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
        >
          {isLoading
            ? "Memproses..."
            : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;