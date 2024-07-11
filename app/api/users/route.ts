import { userSchema } from "@/ValidationSchemas/users";
import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import options from "../auth/[...nextauth]/options";

export async function POST(request: NextRequest) {
  // const session = await getServerSession(options);

  // if (session?.user.role !== "ADMIN") {
  //   return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  // }

  // if (!session) {
  //   return NextResponse.json({ error: "Not Admin" }, { status: 401 });
  // }

  const body = await request.json();
  const validation = userSchema.safeParse(body);

  // show validation error message (from user schema) if validation fails
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  // when creating a user, we can't have a duplicate username
  const duplicate = await prisma.user.findUnique({
    where: {
      username: body.username,
    },
  });

  if (duplicate) {
    return NextResponse.json(
      { message: "Duplicate Username" },
      { status: 409 }
    );
  }

  const hashPassword = await bcrypt.hash(body.password, 10); // hash it 10 times
  body.password = hashPassword;

  const newUser = await prisma.user.create({
    data: { ...body },
  });

  return NextResponse.json(newUser, { status: 201 });
}
