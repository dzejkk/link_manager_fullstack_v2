import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authAPI } from "../services/api";
import styles from "../styles/Register.module.css";

function Register({ onSuccess, onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // mutation

  const registerMutation = useMutation({
    mutationFn: (userData) => authAPI.register(userData),

    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      onSuccess();
    },

    onError: (error) => {
      console.error(`Failed to register user`, error);
    },
  });

  // handlers

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    // Trigger the mutation
    // Note: we only send username, email, password (not confirmPassword)
    registerMutation.mutate({ username, email, password });
  };
  return (
    <div className={styles.container}>
      <div className={styles.registerBox}>
        <h1>Create Account</h1>
        <p className={styles.subtitle}>
          Join us and start organizing your links
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Username input - NEW! */}
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe"
              disabled={registerMutation.isPending}
            />
          </div>

          {/* Email input */}
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={registerMutation.isPending}
            />
          </div>

          {/* Password input */}
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              disabled={registerMutation.isPending}
            />
          </div>

          {/* Confirm Password - NEW! */}
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              disabled={registerMutation.isPending}
            />
          </div>

          {/* Show error if registration fails */}
          {registerMutation.isError && (
            <div className={styles.error}>
              {registerMutation.error.response?.data?.error ||
                "Registration failed. Please try again."}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className={styles.registerButton}
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        {/* Link to login page */}
        <p className={styles.switchText}>
          Already have an account?{" "}
          <button onClick={onSwitchToLogin} className={styles.switchButton}>
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
