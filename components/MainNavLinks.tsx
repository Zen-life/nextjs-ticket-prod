"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function MainNavLinks({ role }: { role?: string }) {
  const links = [
    { label: "Dashboard", href: "/", adminOnly: false },
    { label: "Tickets", href: "/tickets", adminOnly: false },
    { label: "Users", href: "/users", adminOnly: true },
  ];

  const currentPath = usePathname();
  console.log("currentPath:", currentPath); // cmos

  return (
    <div className="flex items-center gap-2">
      {/* filter to show only links with admin set false or show all if role is admin */}
      {links
        .filter((link) => !link.adminOnly || role === "ADMIN")
        .map((link) => (
          <Link
            href={link.href}
            className={`navbar-link ${
              currentPath == link.href &&
              "cursor-default text-primary/70 hover:text-primary/60"
            }`}
            key={link.label}
          >
            {link.label}
          </Link>
        ))}
    </div>
  );
}

export default MainNavLinks;

{
  /* <Link href="/">Dashboard</Link>
<Link href="/tickets">Tickets</Link>
<Link href="/users">Users</Link> */
}
