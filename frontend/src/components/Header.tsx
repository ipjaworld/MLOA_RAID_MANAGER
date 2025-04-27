"use client";

import { useEffect, useState } from "react";
import {
  loginedHeaderMenu,
  logoutedHeaderMenu,
  mainMenuTree,
} from "@/constants/header";
import MLOA_LOGO from "../../public/MLOA_LOGO.png";
import Image from "next/image";
import Link from "next/link";
import DarkmodeToggleBtn from "./btn/DarkmodeToggleBtn";

const LoginedHeader = () => {
  return (
    <ul className="flex list-none gap-[20px]">
      <li>
        <DarkmodeToggleBtn />
      </li>
      {loginedHeaderMenu.map((_c, index) => (
        <li key={index} className="cursor-pointer">
          <Link href={_c.path}>{_c.label}</Link>
        </li>
      ))}
    </ul>
  );
};

const LogoutedHeader = () => {
  return (
    <ul className="flex list-none gap-[20px]">
      <li>
        <DarkmodeToggleBtn />
      </li>
      {logoutedHeaderMenu.map((_c, index) => (
        <li key={index} className="cursor-pointer">
          <Link href={_c.path}>{_c.label}</Link>
        </li>
      ))}
    </ul>
  );
};

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    setIsLoggedIn(false);
  }, []);

  return (
    <header>
      <div className="header-wrapper">
        <div className="flex justify-between items-center max-w-[1440px] mx-auto">
          <ul className="flex list-none items-center">
            <li>
              <Image
                src={MLOA_LOGO}
                alt=""
                priority={true}
                height={60}
                className="mb-10"
              />
            </li>
            {mainMenuTree.map((_c, index) => (
              <li key={index} className="min-w-[130px] text-center">
                <Link href={_c.path}>{_c.label}</Link>
              </li>
            ))}
          </ul>
          {isLoggedIn ? <LoginedHeader /> : <LogoutedHeader />}
        </div>
      </div>
    </header>
  );
}
