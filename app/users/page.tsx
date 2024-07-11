import UserForm from "@/components/UserForm";
import React from "react";
import DataTableSimple from "./data-table-simple";
import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import options from "../api/auth/[...nextauth]/options";

const Users = async () => {
  // const session = await getServerSession(options);

  // // check if user is logged in as admin before displaying user page
  // if (session?.user.role !== "ADMIN") {
  //   return <p className="text-destructive">Admin access required.</p>;
  // }

  // get users from db to pass in DataTableSimple
  const users = await prisma.user.findMany();

  return (
    <div>
      <UserForm />
      <DataTableSimple users={users} />
    </div>
  );
};

export default Users;
