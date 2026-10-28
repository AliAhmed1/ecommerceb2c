import { RegisterForm } from "./components/registerForm";
import MainHeader from "../components/header";
import { isAuthenticated } from "@/utilities/auth";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const isAuth = await isAuthenticated();
  if (isAuth) redirect("/shop");
  return (
    <>
      <MainHeader />
      <RegisterForm />
    </>
  );
}
