import { LoginForm } from "./components/loginForm";
import MainHeader from "../components/header";
import { isAuthenticated } from "@/utilities/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const isAuth = await isAuthenticated();
  if (isAuth) redirect("/shop");
  return (
    <>
      <MainHeader />
      <LoginForm />
    </>
  );
}

