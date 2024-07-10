import React from "react";
import prisma from "@/prisma/db";
import DashRecentTickets from "@/components/DashRecentTickets";
import DashChart from "@/components/DashChart";
import { getServerSession } from "next-auth";
import options from "./api/auth/[...nextauth]/options";

const Dashboard = async () => {
  const session = await getServerSession(options);

  // check if user is logged in as admin before displaying user page
  if (!session) {
    return (
      <p className="text-destructive">
        Login is required to view the Dashboard
      </p>
    );
  }

  const tickets = await prisma.ticket.findMany({
    where: {
      NOT: [{ status: "CLOSED" }],
    },
    orderBy: {
      updatedAt: "desc",
    },
    skip: 0,
    take: 5,
    include: {
      assignedToUser: true,
    },
  });

  const groupTicket = await prisma.ticket.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
  });

  // For simple chart, Recharts can take Name and Total of data to create a chart, so
  // we will get those data from groupTicket
  const data = groupTicket.map((item) => {
    return {
      name: item.status,
      total: item._count.id,
    };
  });

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 px-2">
        <div>
          <DashRecentTickets tickets={tickets} />
        </div>
        <div>
          <DashChart data={data} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
