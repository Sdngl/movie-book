import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register data:", form);
    navigate("/login"); // Redirect to Login
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-white">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-gray-300 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-red-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
