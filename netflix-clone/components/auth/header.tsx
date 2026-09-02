import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function Header() {
    const pathname = usePathname();

    const isLogin = pathname === "/login";

  return (
      <header className="flex items-center justify-between px-52 py-8">        <Image
          src="/images/logo--mjbflix.svg"
          alt="Logo"
          width={220}
          height={80}
          priority={true} />

        <Link href={isLogin ? "/register" : "/login"}>
          <Button variant={'brand-primary'}>
            {isLogin ? "Create an Account"  : "Sign In"}
          </Button>
        </Link>
    </header>
  );
}

export default Header;