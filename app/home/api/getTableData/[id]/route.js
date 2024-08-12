import { db } from '@/utils';
import { USER_DETAILS, USER_TASKS } from '@/utils/schema';
import { NextResponse } from 'next/server';
import { eq, inArray } from 'drizzle-orm'; // Ensure these imports match your ORM version


export async function GET(request, { params }) {
    const { id } = params;
    // const task_id = searchParams.get('task_id');
    console.log("tasku Id", id);
    
    if (!id) {
        return NextResponse.json({ message: 'Invalid task_id' }, { status: 400 });
    }

    try {
        // Step 1: Get user IDs from USER_TASKS where completed = 'yes'
        const userTasks = await db
            .select()
            .from(USER_TASKS)
            .where(eq(USER_TASKS.task_id, id))
            .where(eq(USER_TASKS.completed, 'yes'))
            .execute();

        const userIds = userTasks.map(task => task.user_id);

        console.log("userIds", userIds);
        

        if (userIds.length === 0) {
            return NextResponse.json({ message: 'No completed tasks found for the given task_id' }, { status: 404 });
        }

        // Step 2: Get user details from USER_DETAILS based on user IDs
        const userDetails = await db
            .select()
            .from(USER_DETAILS)
            .where(inArray(USER_DETAILS.id, userIds)) // Ensure `inArray` is available and used correctly
            .execute();

        return NextResponse.json(userDetails);
    } catch (error) {
        console.error('Error fetching user details:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}