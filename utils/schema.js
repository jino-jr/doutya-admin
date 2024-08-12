import { check, date, datetime, decimal, float, index, int, mysqlEnum, mysqlTable, text, time, varchar } from "drizzle-orm/mysql-core";

// export const GRADES = mysqlTable('grades', {
//     id:int('id').primaryKey(),
//     grade:varchar('grade', {length: 10}).notNull()
// })


export const TASKS = mysqlTable('tasks', {
    task_id: int('task_id').primaryKey().autoincrement(),
    challenge_id: int('challenge_id').notNull(),
    task_name: varchar('task_name', { length: 100 }).notNull(),
    description: text('description').notNull(),
    start_date: datetime('start_date').notNull(),
    start_time: time('start_time').notNull(),
    end_date: datetime('end_date').notNull(),
    end_time: time('end_time').notNull(),
    task_type: varchar('task_type', { length: 100 }).notNull(),
    verification_method: varchar('verification_method', { length: 15 }).notNull(),
    entry_points: int('entry_points',{maxValue:100,minValue:1}).notNull(),
    reward_points: int('reward_points',{maxValue:100,minValue:1}).notNull(),
    reward_cash: int('reward_cash',{maxValue:100,minValue:1}).notNull(),
    verification_points: int('verification_points',{maxValue:100,minValue:1}).notNull(),
    is_certificate: varchar('is_certificate', { length: 15 }).notNull(),
    is_badge: varchar('is_badge', { length: 15 }).notNull(),
    player_level: varchar('player_level', { length: 15 }).notNull(),
    created_date: datetime('created_date').notNull(),
    created_by: varchar('created_by', { length: 100 }).notNull(),
    participants_count: int('participants_count').notNull(),
    active: mysqlEnum('active', ['yes', 'no']).notNull(),
    removed_date: datetime('removed_date'),
    removed_by: varchar('removed_by', { length: 100 }),
    day: int('day').notNull().default(0),
    win_mark: int('win_mark').notNull(),
    quiz_type: mysqlEnum('quiz_type', ['normal', 'psychological']).notNull(),
    task_percent: int('task_percent',{maxValue:100,minValue:1}).notNull().default(0),
    task_variety: mysqlEnum('task_variety', ['technical', 'aptitude']).notNull(),
    live: mysqlEnum('live', ['yes', 'no']).notNull(),
    rank: int('rank').notNull().default(10),
});


// Define the schema for the 'challenges' table
export const CHALLENGES = mysqlTable('challenges', {
    challenge_id: int('challenge_id').primaryKey().autoincrement(),
    page_id: int('page_id').notNull(),
    title: varchar('title', { length: 100 }).notNull(),
    description: text('description').notNull(),
    challenge_type: mysqlEnum('challenge_type', ['ordered', 'unordered']).notNull(),
    frequency: mysqlEnum('frequency', [
        'challenges', 'daily', 'bootcamp', 'contest', 'treasure', 'referral', 
        'streak', 'refer', 'quiz', 'food', 'experience'
    ]).notNull(),
    start_date: datetime('start_date').notNull(),
    start_time: time('start_time').notNull(),
    end_date: datetime('end_date').notNull(),
    end_time: time('end_time').notNull(),
    entry_points: int('entry_points').notNull(),
    reward_points: int('reward_points').notNull(),
    level: int('level').default(1).notNull(),
    created_by: varchar('created_by', { length: 100 }).notNull(),
    created_date: datetime('created_date').notNull(),
    participants_count: int('participants_count').default(0).notNull(),
    removed_date: datetime('removed_date'),
    removed_by: varchar('removed_by', { length: 100 }),
    arena: mysqlEnum('arena', ['no', 'yes']).notNull(),
    district_id: int('district_id'),
    visit: mysqlEnum('visit', ['no', 'yes']).notNull(),
    active: mysqlEnum('active', ['no', 'yes']).notNull(),
    days: int('days').default(0).notNull(),
    referral_count: int('referral_count').default(0).notNull(),
    open_for: mysqlEnum('open_for', ['everyone', 'location', 'specific']).notNull(),
    like_based: mysqlEnum('like_based', ['no', 'yes']).notNull(),
    live: mysqlEnum('live', ['no', 'yes']).notNull(),
    questions: int('questions').default(0).notNull(),
    exp_type: mysqlEnum('exp_type', ['biriyani', 'arts', 'breakfast', 'entertainment']).notNull(),
    rewards: mysqlEnum('rewards', ['no', 'yes']).notNull(),
    dep_id: int('dep_id').notNull(),
    page_type: mysqlEnum('page_type', ['job','internship','tests','language','compatibility']).notNull(),
    rounds: int('rounds').notNull(),
    start_datetime: datetime('start_datetime').default(new Date()).notNull(),
    language_id: int('language_id').notNull(),
});

export const USER_DETAILS = mysqlTable('user_details', {
    id: int('id').primaryKey().autoincrement(),
    name: varchar('name', { length: 150 }).notNull(),
    gender: varchar('gender', { length: 150 }).default(null),
    mobile: varchar('mobile', { length: 100 }).default(null),
    image: varchar('image', { length: 150 }).default(null),
    birth_date: date('birth_date').default(null),
    country: int('country').default(null),
    state: int('state').default(null),
    firebase_token: varchar('firebase_token', { length: 200 }).default(null),
    steps: int('steps').default(1).notNull(),
    followers: int('followers').default(0).notNull(),
    email: varchar('email', { length: 150 }).default(null),
    achievement: int('achievement').default(5).notNull(),
    referral_id: varchar('referral_id', { length: 50 }).default(null),
    referral_count: int('referral_count').default(0).notNull(),
    password: varchar('password', { length: 150 }).notNull(),
    username: varchar('username', { length: 150 }).default(null),
    account_status: mysqlEnum('account_status', ['public', 'private']).notNull(),
    education: varchar('education', { length: 200 }).default(null),
    location: varchar('location', { length: 200 }).default(null),
    resume: varchar('resume', { length: 200 }).default(null),
    student: mysqlEnum('student', ['no', 'yes']).notNull(),
    college: text('college').default(null),
    university: text('university').default(null),
    yearOfPassing: varchar('yearOfPassing', { length: 150 }).default(null),
    monthOfPassing: varchar('monthOfPassing', { length: 150 }).default(null)
}, (user_details) => ({
    // Defining an index on the 'email' column
    emailIdx: index('email_idx').on(user_details.email),
}));

// Define the schema for the 'page' table
export const PAGE = mysqlTable('page', {
    id: int('id').primaryKey().notNull(),
    title: varchar('title', { length: 150 }).notNull(),
    description: text('description').notNull(),
    start_date: datetime('start_date').notNull(),
    end_date: datetime('end_date').notNull(),
    icon: varchar('icon', { length: 150 }).notNull(),
    banner: varchar('banner', { length: 150 }).notNull(),
    active: mysqlEnum('active', ['yes', 'no']).notNull(),
    followers: int('followers').default(0).notNull(),
    type: varchar('type', { length: 150 }).notNull(),
    password: varchar('password', { length: 150 }).notNull(),
    super_admin: mysqlEnum('super_admin', ['no', 'yes']).notNull(),
    email: varchar('email', { length: 150 }).notNull(),
    slug: varchar('slug', { length: 300 }).notNull(),
});

export const QUESTIONS = mysqlTable('questions', {
    id: int('id').primaryKey().autoincrement(),
    type: mysqlEnum('type', ['text', 'audio', 'video', 'image']).notNull(),
    timer: int('timer').notNull(),
    video: varchar('video', { length: 150 }),
    audio: varchar('audio', { length: 150 }),
    image: varchar('image', { length: 150 }),
    question: text('question').notNull(),
    challenge_id: int('challenge_id').notNull(),
    task_id: int('task_id').notNull(),
    option: mysqlEnum('option', ['normal', 'poison', 'bonus']).notNull(),
    stars: int('stars').notNull().default(0),
    quiz_type: mysqlEnum('quiz_type', ['least', 'most']).notNull(),
});

export const ANSWERS = mysqlTable('answers', {
    id: int('id').primaryKey().autoincrement(),
    question_id: int('question_id').notNull(),
    answer_text: text('answer_text').notNull(),
    answer: mysqlEnum('answer', ['no', 'yes']).notNull(),
    task_marks: decimal('task_marks', { precision: 10, scale: 2 }),
});

export const USER_TASKS = mysqlTable('user_tasks', {
    id: int('id').primaryKey().autoincrement(),
    task_id: int('task_id').notNull(),
    user_id: int('user_id').notNull(),
    reward_points: int('reward_points').default(0),
    approved: mysqlEnum('approved', ['nill', 'yes', 'no']).notNull(),
    entry_points: int('entry_points').default(0).notNull(),
    rejected: mysqlEnum('rejected', ['no', 'yes']).notNull(),
    start_date: datetime('start_date').default(new Date()).notNull(),
    start_time: time('start_time'),
    end_date: datetime('end_date'),
    end_time: time('end_time'),
    steps: int('steps').default(0),
    approved_by: varchar('approved_by', { length: 100 }),
    completed: mysqlEnum('completed', ['no', 'yes']).notNull(),
    arena: mysqlEnum('arena', ['no', 'yes']).notNull(),
    challenge_id: int('challenge_id').notNull(),
    image: varchar('image', { length: 150 }),
    video: varchar('video', { length: 150 }),
    day: int('day').default(0).notNull(),
    started: mysqlEnum('started', ['no', 'yes']).notNull(),
  });