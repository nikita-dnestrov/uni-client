"use client";

import { useState } from "react";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";

export default function Page() {
  const [view, setView] = useState("login");

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      {view === "login" ? (
        <LoginForm onViewChange={() => setView("register")} />
      ) : (
        <RegisterForm onViewChange={() => setView("login")} />
      )}
    </div>
  );
}
