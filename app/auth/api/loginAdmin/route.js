import { NextResponse } from 'next/server';
import { db } from '@/utils';
import { comparePassword } from '@/utils/bcryptUtils';
import jwt from 'jsonwebtoken';
import { PAGE, USER_DETAILS } from '@/utils/schema';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { pageData } from '@/lib/samplePageData';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is reqired')
});

export async function POST(req) {
  try {
    const data = await req.json(); 
    console.log("Received data:", data);

    // Validate input
    const validation = loginSchema.safeParse(data);
    if (!validation.success) {
      return NextResponse.json({ message: validation.error.errors[0].message }, { status: 400 });
    }

    const { email, password } = data;

    // Fetch user from the database
    const [existingUser] = await db
      .select()
      .from(PAGE)
      .where(eq(PAGE.email, email))
      .execute();
    
    if (!existingUser) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    const isValid = await comparePassword(password, existingUser.password);

    if (!isValid) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign(
      { pageId: existingUser.id, email: existingUser.email },process.env.JWT_SECRET_KEY,
    //   { expiresIn: '1h' }
    );

    return NextResponse.json({ token }, { status: 200 }, { message: 'Loggedin successfully.' });
  } catch (error) {
    console.error('Internal server error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
};
