const pool = require("../config/db.js")

const Task = {
    addTask: async ({ user_id, title, task_description }) => {
        const [tasks] = await pool.query(`
            select * from Tasks where user_id = ? and title = ?;
        `, [user_id, title]);
        if (tasks.length !== 0)
            return { error: "The task already exists" }
        const [res] = await pool.query(`
            insert into Tasks (user_id, title, task_description) values
            (?, ?, ?);
        `, [user_id, title, task_description]);
        return {
            success: true,
            task_id: res.insertId 
        };
    },

    updatebyProgess: async ({ task_id, progress }) => {
        const [row] = await pool.query(`
            select * from Tasks where task_id = ?;
        `, [task_id]);
        if (row.length === 0)
            return { error: "Task doesn't exist" }
        const [res] = await pool.query(`
            update Tasks set progress = ? where task_id = ?; 
        `, [progress, task_id]);
        return { success: true };
    },

    updatebyTitle: async ({ task_id, title }) => {
        const [row] = await pool.query(`
            select * from Tasks where task_id = ?;
        `, [task_id]);
        if (row.length === 0)
            return { error: "Task doesn't exist" }
        const [res] = await pool.query(`
            update Tasks set title = ? where task_id = ?; 
        `, [title, task_id]);
        return { success: true };
    },

    updatebyDescription: async ({ task_id, task_description }) => {
        const [row] = await pool.query(`
            select * from Tasks where task_id = ?;
        `, [task_id]);
        if (row.length === 0)
            return { error: "Task doesn't exist" }
        const [res] = await pool.query(`
            update Tasks set task_description = ? where task_id = ?;    
        `, [task_description, task_id]);
        return { success: true };
    },

    removeTask: async ({ task_id }) => {
        const [row] = await pool.query(`
            select * from Tasks where task_id = ?;
        `, [task_id]);
        if (row.length === 0)
            return { error: "Task doesn't exist" }
        const [res] = await pool.query(`
            delete from Tasks where task_id = ?;    
        `, [task_id]);
        return { success: true };
    },

    getTask: async ({ user_id }) => {
        const [row] = await pool.query(`
            select * from Tasks where user_id = ?; 
        `, [user_id]);
        return row;
    }
};

module.exports = Task;