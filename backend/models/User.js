const { query } = require('express');
const { bcrypt } = require('bcrypt');
const pool = require("../config/db")
const saltround = 13;

// can use prisma orm instead
const User = {
    createUser: async ({ user_name, full_name, password }) => {
        const q1 = `select * from Users where user_name = ?;`;
        const [rows] = await pool.query(q1, [user_name]);
        if (rows.length !== 0)
            return { error: "Username already exists" };
        const hash = bcrypt.hashSync(password, saltround);
        const query = `
            insert into Users (user_name, full_name, password) 
            values (?, ?, ?);
        `;
        const [res] = await pool.query(query, [user_name, full_name, hash]);
        return {
            success: true,
            user_id: res.insertId
        };
    },

    login: async ({ user_name, password }) => {
        const query = `select * from Users where user_name = ?;`;
        const [rows] = await pool.query(query, [user_name]);
        if (rows.length === 0)
            return { error: "Users doesnot exist" };
        const user = rows[0];
        if (bcrypt.compareSync(password, user.password)) {
            return {
                success: true,
                user_id: user.user_id,
                user_name: user_name,
                full_name: user.full_name
            };
        }
        return { error: "Username and password are mismatched" }
    },

    changePassword: async ({ user_id, oldPassword, newPassword }) => {
        const q1 = `select * from Users where user_id = ?;`;
        const [rows] = await pool.query(q1, [user_id]);
        if (rows.length === 0)
            return { error: "Users doesnot exist" };
        const user = rows[0];
        if (bcrypt.compareSync(oldPassword, rows.password)) {
            const hash = bcrypt.hashSync(newPassword, saltround);
            const query = `update Users set password = ? where user_id = ?;`;
            const [res] = await pool.query(query, [hash, user_id]);
            return { success: true };
        }
        return { error: "Wrong password" }
    },

    removeUser: async ({ user_id, password }) => {
        const [rows] = await pool.query(`
            select * from Users where user_id = ?;
        `, [user_id]);
        if (rows.length === 0)
            return { error: "User doesn't exist" };
        const user = rows[0];
        if (bcrypt.compareSync(password, user.password)) {
            const [res] = await pool.query(`
                delete from Users where user_id = ?;
            `, [user_id]);
            return { success: true };
        }
        return { error: "Wrong password" }
    },

    getAllUsers: async () => {
        return await pool.query(`
            select * from user_list;
        `);
    },

    getById: async ({ id }) => {
        return await pool.query(`
            select * from user_list where user_id = ?;
        `, [id]);
    }
};
module.exports = User;