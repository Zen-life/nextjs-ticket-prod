import { ticketSchema } from "@/ValidationSchemas/ticket";
import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const body = await request.json();
  const validation = ticketSchema.safeParse(body);

  // check if the has errors, then send message to user, with code 400
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  // get a ticket to check what needs updating
  // nb. id is string grabbed from the url params. Use parseInt() to make it integer for the db
  const ticket = await prisma.ticket.findUnique({
    where: { id: parseInt(params.id) },
  });

  // check if there's no ticket, then return error mse with status 404
  if (!ticket) {
    return NextResponse.json({ error: "Ticket Not Found" }, { status: 404 });
  }

  // if there is a ticket, then we need the id and data
  // ticket.id comes from const ticket, which already has parseInt(0, so it's num already.)
  const updateTicket = await prisma.ticket.update({
    where: { id: ticket.id },
    data: {
      ...body,
    },
  });

  // update the db with the unique id and data
  return NextResponse.json(updateTicket);
}
