import { useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<"login" | "register">("login");

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-8 rounded-md shadow-lg relative w-full max-w-md"
      >
        {mode === "login" ? (
          <Login switchTo={() => setMode("register")} />
        ) : (
          <Register switchTo={() => setMode("login")} />
        )}
      </div>
    </div>
  );
};

interface AuthFormProps {
  switchTo: () => void;
}

const Login: React.FC<AuthFormProps> = ({ switchTo }) => {
  return (
    <form>
      <div className="flex flex-col gap-6 ">
        <h2 className="text-center text-2xl font-bold">UP-load</h2>
        <input
          type="email"
          placeholder="Email"
          name="email"
          className="border border-gray-300 p-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border border-gray-300 p-2 rounded"
        />
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

const Register: React.FC<AuthFormProps> = ({ switchTo }) => {
  return (
    <form>
      <div className="flex flex-col gap-6">
        <h2 className="text-center text-2xl font-bold">UP-load</h2>
        <input
          type="email"
          placeholder="Email"
          name="email"
          className="border border-gray-300 p-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border border-gray-300 p-2 rounded"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="border border-gray-300 p-2 rounded"
        />
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
