import React from "react";
import prisma from "@/prisma/db";
import DataTable from "./DataTable";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const Tickets = async () => {
  // using prisma to get data from mysql db
  const tickets = await prisma.ticket.findMany();

  return (
    <div>
      <Link
        href="/tickets/new"
        className={buttonVariants({ variant: "default" })}
      >
        New Ticket
      </Link>
      <DataTable tickets={tickets} />
    </div>
  );
};

export default Tickets;
