import { db } from "@/utils";
import { hashPassword } from "@/utils/bcryptUtils";
import { USER_DETAILS } from "@/utils/schema";
import { NextResponse } from "next/server";
import { z } from 'zod';
import { eq } from 'drizzle-orm'

const registrationSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
        }),
    email: z.string().email(),
    password: z.string().min(6, 'Password must be at least 6 characters long')
});

export async function POST(req) {  
    try {
      const data = await req.json(); 
  
      // Validate input
      const validation = registrationSchema.safeParse(data);
      if (!validation.success) {
        return NextResponse.json({ message: validation.error.errors[0].message }, { status: 400 });
      }
  
      const {
        username,
        name,
        email,
        mobile,
        password: rawPassword,
        gender,
        birth_date,
        country,
        state,
        location,
        education,
        college,
        university,
        student,
        yearOfPassing,
        monthOfPassing,
        resume,
      } = data;
  
        // Check if user already exists
        const existingUser = await db
        .select()
        .from(USER_DETAILS)
        .where(eq(USER_DETAILS.email, email))
        .execute();
      if (existingUser.length > 0) {
        return NextResponse.json({ message: 'User already exists' }, { status: 400 });
      }
  
      // Hashingg the password
      const hashedPassword = await hashPassword(rawPassword);
  
        // Insert new user into the database
        await db
        .insert(USER_DETAILS)
        .values({
          username,
          name,
          email,
          mobile,
          password: hashedPassword,
          gender,
          birth_date,
          country,
          state,
          location,
          education,
          college,
          university,
          student,
          yearOfPassing,
          monthOfPassing,
          resume,
          image: 'sample.jpg',
        })
        .execute();

      return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    } catch (error) {
      console.error('Internal server error:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  };