import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, registerSchema } from "../../validation/auth.validation";
import { LoginData, RegisterData } from "../../types/auth";
import { loginUser, registerUser } from "../../api/apiAuth";

import { useAuthStore } from "../../store/useAuthStore";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<"login" | "register">("login");

  if (!isOpen) return null;

  const handleOnClose = (): void => {
    setMode("login");
    onClose();
  };

  return (
    <div
      onClick={handleOnClose}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-8 rounded-md shadow-lg relative w-full max-w-md"
      >
        {mode === "login" ? (
          <Login switchTo={() => setMode("register")} onClose={handleOnClose} />
        ) : (
          <Register switchTo={() => setMode("login")} onClose={handleOnClose} />
        )}
      </div>
    </div>
  );
};

interface AuthFormProps {
  switchTo: () => void;
  onClose: () => void;
}

const Login: React.FC<AuthFormProps> = ({ switchTo, onClose }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const setToken = useAuthStore((state) => state.setToken);

  const onSubmit = async (data: LoginData) => {
    try {
      const response = await loginUser(data);
      const token = response.data.accessToken;
      setToken(token);
      onClose();
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        const serverErrors = error.response.data.errors;

        Object.entries(serverErrors).forEach(([field, messages]) => {
          setError(field as keyof LoginData, {
            type: "server",
            message: (messages as string[]).join(", "),
          });
        });
      } else {
        console.error(error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-6">
        <h2 className="text-center text-2xl font-bold">UP-load</h2>

        <div className="flex flex-col gap-1">
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className={`border p-2 rounded ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <span className="text-red-500 text-sm mb-[-15px]">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="border p-2 rounded "
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Login
        </button>

        <div
          onClick={switchTo}
          className="text-center cursor-pointer hover:underline"
        >
          Don’t have an account?
        </div>
      </div>
    </form>
  );
};

const Register: React.FC<AuthFormProps> = ({ switchTo, onClose }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      const response = await registerUser(data);
      console.log(response.data);
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        const serverErrors = error.response.data.errors;

        Object.entries(serverErrors).forEach(([field, messages]) => {
          setError(field as keyof RegisterData, {
            type: "server",
            message: (messages as string[]).join(", "),
          });
        });
      } else {
        console.error(error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-6">
        <h2 className="text-center text-2xl font-bold">UP-load</h2>

        <div className="flex flex-col gap-1">
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className={`border p-2 rounded ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <span className="text-red-500 text-sm mb-[-15px]">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className={`border p-2 rounded ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <span className="text-red-500 text-sm mb-[-15px]">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <input
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword")}
            className={`border p-2 rounded  ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm mb-[-15px]">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Register
        </button>

        <div
          onClick={switchTo}
          className="text-center cursor-pointer hover:underline"
        >
          Already have an account?
        </div>
      </div>
    </form>
  );
};

export default AuthModal;
