import { db } from "@/utils";
import { hashPassword } from "@/utils/bcryptUtils";
import { PAGE, USER_DETAILS } from "@/utils/schema";
import { NextResponse } from "next/server";
import { pageData } from "@/lib/samplePageData";
import { encrypt } from "@/utils/cryptoUtils";
import { createSlug } from "@/lib/createSlug";


export async function GET(req) {  
    try {

      const { 
        title, 
        description, 
        start_date, 
        end_date, 
        icon, 
        banner, 
        active, 
        followers, 
        type, 
        password, 
        super_admin, 
        email, 
    } = pageData
  
        // Hashingg the password
        const hashedPassword = await hashPassword(password);

        // Encrypting the description
        const encryptedDescrption = encrypt(description);

        /* Creating Slug using page */
        const slug = createSlug(title);

        // Insert new user into the database
        await db
        .insert(PAGE)
        .values({
            title, 
            description: encryptedDescrption, 
            start_date, 
            end_date, 
            icon, 
            banner, 
            active, 
            followers, 
            type, 
            password: hashedPassword, 
            super_admin, 
            email,
            slug
        })
        .execute();

      return NextResponse.json({ message: 'Page registered successfully' }, { status: 201 });
    } catch (error) {
      console.error('Internal server error:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  };