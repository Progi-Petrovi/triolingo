import * as React from "react";
import { Link, LinkProps, redirect } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import useUserContext from "@/context/use-user-context";
import { renderHeader } from "@/utils/main";

export function MobileNav() {
    const [open, setOpen] = React.useState(false);

    const onOpenChange = (open: boolean) => {
        setOpen(open);
    };

    const pathname = location.pathname;

    const { user } = useUserContext();

    const navConfig = renderHeader(user);

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerTrigger asChild>
                <Button
                    id="drawer-button"
                    variant="ghost"
                    className="-ml-2 mr-2 h-8 w-8 px-0 text-base md:hidden"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="!size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 9h16.5m-16.5 6.75h16.5"
                        />
                    </svg>
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[60svh] p-0">
                <div className="overflow-auto p-6">
                    <div className="flex flex-col space-y-3">
                        {navConfig.mainNavMobile?.map(
                            (item) =>
                                item.href && (
                                    <MobileLink
                                        key={item.href}
                                        to={item.href}
                                        onOpenChange={setOpen}
                                        className={cn(
                                            pathname === item.href
                                                ? "text-foreground"
                                                : "text-foreground/60"
                                        )}
                                    >
                                        {item.title}
                                    </MobileLink>
                                )
                        )}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

interface MobileLinkProps extends LinkProps {
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
    className?: string;
}

function MobileLink({
    to,
    onOpenChange,
    className,
    children,
    ...props
}: MobileLinkProps) {
    return (
        <Link
            to={to}
            onClick={() => {
                redirect(to.toString());
                onOpenChange?.(false);
            }}
            className={cn("text-base", className)}
            {...props}
        >
            {children}
        </Link>
    );
}
