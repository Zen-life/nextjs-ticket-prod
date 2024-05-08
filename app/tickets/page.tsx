import React from "react";
import prisma from "@/prisma/db";
import DataTable from "./DataTable";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import StatusFilter from "@/components/StatusFilter";
import { Status } from "@prisma/client";

interface SearchParams {
  status: Status;
  page: string;
}

const Tickets = async ({ searchParams }: { searchParams: SearchParams }) => {
  const pageSize = 10; // number of items to display at a time
  const page = parseInt(searchParams.page) || 1; // get current page or set it 1

  const statuses = Object.values(Status); // ensure the correct status are parsed

  // check to see if the parsed in value on the searchParams status is included in the possible list of statuses.
  // stops someone trying to parse in something that is not not part of status list
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

  // editable where clause; where status: 'OPEN', where status: 'CLOSED', etc.
  let where = {};
  if (status) {
    where = {
      status,
    };
  } else {
    where = {
      NOT: [{ status: "CLOSED" as Status }], // if no status is selected, show tickets that are not closed
    };
  }

  const ticketCount = await prisma.ticket.count({ where }); // get total number of tickets
  // using prisma to get data from mysql db
  const tickets = await prisma.ticket.findMany({
    where,
    take: pageSize,
    skip: (page - 1) * pageSize,
  });

  return (
    <div>
      <div className="flex gap-2">
        <Link
          href="/tickets/new"
          className={buttonVariants({ variant: "default" })}
        >
          New Ticket
        </Link>
        <StatusFilter />
      </div>
      <DataTable tickets={tickets} />
      <Pagination
        itemCount={ticketCount}
        pageSize={pageSize}
        currentPage={page}
      />
    </div>
  );
};

export default Tickets;
