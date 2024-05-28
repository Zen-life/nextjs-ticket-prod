import React from "react";
import prisma from "@/prisma/db"; // this page renders on server side hence direct access to the db
import TicketDetail from "./TicketDetail";

interface Props {
  params: { id: string };
}

const ViewTicket = async ({ params }: Props) => {
  // checks that parseID is integer. letters will return null above
  const parseID = parseInt(params.id) ? parseInt(params.id) : null;
  let ticket;

  if (parseID) {
    ticket = await prisma.ticket.findUnique({
      where: { id: parseID },
    });
  }

  const users = await prisma.user.findMany();

  if (!ticket) {
    return <p className="text-destructive">Ticket Not Found!</p>;
  }

  return <TicketDetail ticket={ticket} users={users} />;
};

export default ViewTicket;
