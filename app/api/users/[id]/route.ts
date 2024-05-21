import { userSchema } from "@/ValidationSchemas/users";
import prisma from "@/prisma/db";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const body = await request.json();
  const validation = userSchema.safeParse(body);

  // show validation error message (from user schema) if validation fails
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  // find the user requiring an update
  const user = await prisma.user.findUnique({
    where: { id: parseInt(params.id) },
  });

  // if there is no user in the db that match the id (maybe someone playing with the system)
  if (!user) {
    return NextResponse.json({ error: "User Not Found" }, { status: 404 });
  }

  // hashing the password
  if (body?.password && body.password != "") {
    const hashPassword = await bcryptjs.hash(body.password, 10);
    body.password = hashPassword;
  } else {
    delete body.password;
  }

  // check if changing username, make it unique
  if (user.username !== body.username) {
    const duplicateUsername = await prisma.user.findUnique({
      where: { username: body.username },
    });

    if (duplicateUsername) {
      return NextResponse.json(
        { message: "Duplicate Username" },
        { status: 409 }
      );
    }
  }

  //if all the checks are good, then we are ready to update the db
  const updateUser = await prisma.user.update({
    where: { id: user.id },
    data: { ...body },
  });

  return NextResponse.json(updateUser);
}
