import { ticketSchema } from "@/ValidationSchemas/ticket";
import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

// POST is the end point that gets called when a ticket is created.
export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = ticketSchema.safeParse(body);

  //check if validation was successful or not
  if (!validation.success) {
    // validation.error.format() will send the error message to the user with status 400
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  // if validation was successful
  const newTicket = await prisma.ticket.create({
    data: { ...body },
  });

  // 201 is new created record okay
  return NextResponse.json(newTicket, { status: 201 });
}
