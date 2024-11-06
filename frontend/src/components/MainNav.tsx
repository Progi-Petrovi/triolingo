import { Link, useLocation } from "react-router-dom";

import SiteConfig from "@/config/site";
import { navConfig } from "@/config/header-nav";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";


export function MainNav() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="mr-4 hidden md:flex">
      <Link to="/" className="mr-4 flex items-center space-x-2 lg:mr-6">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold lg:inline-block">
          {SiteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        {navConfig.mainNav?.map(
          (item) => (
            <Link
              to={item.href}
              key={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === item.href ? "text-foreground" : "text-foreground/60"
              )}
            >
              {item.title}
            </Link>
          )
        )}
      </nav>
    </div>
  )
}