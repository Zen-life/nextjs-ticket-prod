import TicketForm from "@/components/TicketForm";
import prisma from "@/prisma/db";
// import dynamic from "next/dynamic";
import React from "react";

interface Props {
  params: { id: string };
}

// const TicketForm = dynamic(() => import("@/components/TicketForm"), {
//   ssr: false,
// });

const EditTicket = async ({ params }: Props) => {
  // params will have id of the ticket. we need to find the ticket with the id
  // and display the ticket data/details in the form, title, description, priority, status etc. ready for editing
  const ticket = await prisma?.ticket.findUnique({
    where: { id: parseInt(params.id) },
  });

  // if thers's no ticket or a ticket id has been manuallly added incorrectly
  if (!ticket) {
    return <p className="text-destructive"> Ticket not found!</p>;
  }

  return <TicketForm ticket={ticket} />;
};

export default EditTicket;
