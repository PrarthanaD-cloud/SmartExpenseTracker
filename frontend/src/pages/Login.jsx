import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await API.post("/auth/login", form);
localStorage.setItem(
  "token",
  response.data.token
);

localStorage.setItem(
  "name",
  response.data.name
);

localStorage.setItem(
  "email",
  form.email
);

navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">
          Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/signup")}
          className="w-full mt-3 border border-indigo-600 text-indigo-600 py-3 rounded-lg hover:bg-indigo-50 transition"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}

export default Login;