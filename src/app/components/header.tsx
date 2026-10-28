import Link from "next/link";
import { BuildingStorefrontIcon, ShoppingCartIcon } from "@heroicons/react/24/solid";
import { LogIn } from "./login";
import { LogOut } from "./logout";
import classes from "./header.module.css";
import { getCurrentUser } from "@/utilities/auth";
import { getCartItemCount } from "@/db/query";

const MainHeader = async () => {
  const user = await getCurrentUser();
  const cartCount = user ? await getCartItemCount(user.id) : 0;

  return (
    <header className="bg-white w-full shadow-md border-b-2">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/shop" className='className="-m-1.5 p-1.5"'>
            <BuildingStorefrontIcon className="h-16 w-16 text-indigo-500 cursor-pointer" />
          </Link>
        </div>
        <div className="hidden lg:flex flex-1 justify-end items-center gap-x-12">
          <Link
            href="/shop"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            <div className={classes.cart}>Shop Now</div>
          </Link>
          <Link
            href="/cart"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            <div className={classes.cart}>
              <ShoppingCartIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className={classes.count}>{cartCount}</span>
              )}
            </div>
          </Link>
          {user && (
            <>
              <Link
                href="/orders"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                <div className={classes.cart}>My Orders</div>
              </Link>
              <LogOut />
            </>
          )}
          {!user && <LogIn />}
        </div>
      </nav>
    </header>
  );
};

export default MainHeader;

