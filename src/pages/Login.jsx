import React, { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { auth } from "../config/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);

      // Determine role based on email
      const role = userCredential.user.email === "admin123@gmail.com" ? "admin" : "user";

      const userData = {
        uid: userCredential.user.uid,
        displayName: userCredential.user.displayName || "User",
        email: userCredential.user.email,
        role,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData); // update state

      navigate("/"); // redirect after login
    } catch (err) {
      alert(err.message);
    }
  };

  // If already logged in, redirect to home
  if (user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-white text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-300 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-red-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
