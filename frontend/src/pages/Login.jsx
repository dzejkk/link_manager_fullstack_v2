import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authAPI } from "../services/api";
import styles from "../styles/Login.module.css";

function Login({ onSuccess, onSwitchToRegister }) {
  // local state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //useMutation - tanstack
  const loginMutation = useMutation({
    mutationFn: (credentials) => authAPI.login(credentials),

    onSuccess: (data) => {
      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify(data.user));

      onSuccess();
    },

    onError: (error) => {
      console.error("login failed", error);
    },
  });

  // handlers

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    // Trigger the mutation (makes the API call)
    loginMutation.mutate({ email, password });
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1>Login</h1>
        <p className={styles.subtitle}>Welcome back! Sign in to your account</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Email input */}
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={loginMutation.isPending} // Disable while loading
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
              placeholder="••••••••"
              disabled={loginMutation.isPending}
            />
          </div>

          {/* Show error if login fails */}
          {loginMutation.isError && (
            <div className={styles.error}>
              {loginMutation.error.response?.data?.error ||
                "Login failed. Please try again."}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className={styles.loginButton}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Link to register page */}
        <p className={styles.switchText}>
          Don't have an account?{" "}
          <button onClick={onSwitchToRegister} className={styles.switchButton}>
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
