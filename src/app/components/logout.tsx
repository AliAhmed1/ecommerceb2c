'use client'
import { logout } from "../actions/logout";
import classes from "./header.module.css";
import { useRouter } from "next/navigation";

export const LogOut = () => {
  const router = useRouter();
  const handleLogOut = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };
  return (
    <button
      onClick={handleLogOut}
      className="text-sm font-semibold leading-6 text-gray-900 cursor-pointer"
    >
      <div className={classes.cart}>Logout</div>
    </button>
  );
};

