const db = require('../db/mysql');
const { GraphQLError } = require('graphql');
const bcrypt = require('bcrypt');

const resolvers = {
  Query: {
    users: async (_, args) => {
      let query, params;

      if (args.id) {
        query = 'SELECT * FROM user WHERE id = ?';
        params = [args.id];
      } else {
        query = 'SELECT * FROM user';
        params = [];
      }

      const [rows] = await db.query(query, params);

      // Konversi buffer ke string base64 (untuk foto)
      const users = rows.map(user => {
        return {
          ...user,
          foto: user.foto ? user.foto.toString('base64') : null,
        };
      });

      return users;
    }
  },

  Mutation: {
    createUser: async (_, { nama, no_hp, email, password }) => {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const [result] = await db.query(
        'INSERT INTO user (nama, no_hp, email, password) VALUES (?, ?, ?, ?)',
        [nama, no_hp, email, hashedPassword]
      );

      return {
        id: result.insertId,
        nama,
        no_hp,
        email,
        password: hashedPassword,
        foto: null,
      };
    },

    updateUser: async (_, { id, nama, no_hp, email, password, foto }) => {
      const [rows] = await db.query('SELECT * FROM user WHERE id = ?', [id]);
      if (!rows[0]) throw new Error('User not found');

      const user = rows[0];

      // Pakai data lama jika input kosong/null
      const newNama = nama ?? user.nama;
      const newNoHp = no_hp ?? user.no_hp;
      const newEmail = email ?? user.email;
      const newFoto = foto ?? user.foto;

      // Hash password jika ada yang baru dikirim
      let newPassword;
      if (password && password.trim() !== '') {
        const saltRounds = 10;
        newPassword = await bcrypt.hash(password, saltRounds);
      } else {
        newPassword = user.password; // gunakan password lama
      }

      await db.query(
        'UPDATE user SET nama = ?, no_hp = ?, email = ?, password = ?, foto = ? WHERE id = ?',
        [newNama, newNoHp, newEmail, newPassword, newFoto, id]
      );

      return {
        id,
        nama: newNama,
        no_hp: newNoHp,
        email: newEmail,
        password: newPassword,
        foto: newFoto,
      };
    },

    deleteUser: async (_, { id }) => {
      const [result] = await db.query('DELETE FROM user WHERE id = ?', [id]);
      return result.affectedRows > 0;
    },

    login: async (_, { email, password }) => {
      const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
      const user = rows[0];

      if (!user) {
        throw new GraphQLError('Email tidak ditemukan');
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new GraphQLError('Password salah');
      }

      return user;
    }
  }
};

module.exports = resolvers;
