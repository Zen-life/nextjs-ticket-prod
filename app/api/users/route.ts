import { userSchema } from "@/ValidationSchemas/users";
import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
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
