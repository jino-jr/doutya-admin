import { db } from "@/utils";
import { decrypt } from "@/utils/cryptoUtils";
import { TASKS, USER_DETAILS, USER_TASKS } from "@/utils/schema";
import { NextResponse } from "next/server";


export async function GET(request, { params }) {
    const { id } = params;

  if (!id) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
  }

  try {
      const userDetailsResults = await db.select().from(USER_DETAILS).where({ id });

      if (!userDetailsResults.length) {
          return NextResponse.json({ error: 'No users found for the selected id' }, { status: 404 });
      }
      
    // Fetch from USER_TASKS table
    const userTasksResults = await db.select().from(USER_TASKS).where({ user_id: id });

    if(userTasksResults.length > 0){
        // Extract task IDs from userTasksResults
        const taskIds = userTasksResults.map(task => task.task_id);
        console.log("got tasks", taskIds);
        const tasksResults = [];

        for (const taskId of taskIds) {
            const taskResult = await db.select().from(TASKS).where({ task_id: taskId });
            tasksResults.push(...taskResult);
        }
        // Fetch task names from TASKS table
        // const tasksResults = await db.select().from(TASKS).whereIn('id', taskIds);

        
        

        // Create a map of task names keyed by task ID
        const taskNameMap = tasksResults.reduce((map, task) => {
            map[task.task_id] = decrypt(task.task_name); // Decrypt if necessary
            return map;
        }, {});

        console.log("taskNameMap", taskNameMap);
        

        // Update userTasksResults with task names
        const updatedUserTasksResults = userTasksResults.map(task => ({
            ...task,
            task_name: taskNameMap[task.task_id] || 'Unknown Task'
        }));

        const combinedResults = {
            userDetails: userDetailsResults,
            userTasks: updatedUserTasksResults,
          };

          return NextResponse.json(combinedResults, { status: 200 });
    } else {
        const combinedResults = {
            userDetails: userDetailsResults,
            userTasks: [],
          };

          return NextResponse.json(combinedResults, { status: 200 });
    }
    
  } catch (error) {
      console.error('Error fetching tasks:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}