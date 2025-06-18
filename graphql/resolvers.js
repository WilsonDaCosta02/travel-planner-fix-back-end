const db = require('../db/mysql');
const { GraphQLError } = require('graphql');
const bcrypt = require('bcrypt');

const resolvers = {
  Query: {
    users: async (_, args) => {
      let query, params;

      if (args.id) {
        query = "SELECT * FROM user WHERE id = ?";
        params = [args.id];
      } else {
        query = "SELECT * FROM user";
        params = [];
      }

      const [rows] = await db.query(query, params);

      return rows.map(user => ({
        ...user,
        foto: user.foto ? user.foto.toString("base64") : null,
      }));
    },

    trips: async (_, { user_id }) => {
      const [rows] = await db.query(
        "SELECT * FROM trip WHERE user_id = ? ORDER BY start_date",
        [user_id]
      );
      return rows;
    },

    dreamDestinations: async (_, { user_id }) => {
      const [rows] = await db.query(
        "SELECT * FROM dream_trip WHERE user_id = ?",
        [user_id]
      );

      return rows.map(dest => ({
        id: dest.id,
        user_id: dest.user_id,
        name: dest.name,
        image: dest.image ? dest.image.toString("base64") : null,
      }));
    },
  },

  Mutation: {
    createUser: async (_, { nama, no_hp, email, password }) => {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const [result] = await db.query(
        "INSERT INTO user (nama, no_hp, email, password) VALUES (?, ?, ?, ?)",
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
      const [rows] = await db.query("SELECT * FROM user WHERE id = ?", [id]);
      if (!rows[0]) throw new Error("User not found");

      const user = rows[0];
      const newNama = nama ?? user.nama;
      const newNoHp = no_hp ?? user.no_hp;
      const newEmail = email ?? user.email;
      const newFoto = foto ?? user.foto;

      let newPassword;
      if (password && password.trim() !== "") {
        const saltRounds = 10;
        newPassword = await bcrypt.hash(password, saltRounds);
      } else {
        newPassword = user.password;
      }

      await db.query(
        "UPDATE user SET nama = ?, no_hp = ?, email = ?, password = ?, foto = ? WHERE id = ?",
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
      const [result] = await db.query("DELETE FROM user WHERE id = ?", [id]);
      return result.affectedRows > 0;
    },

    login: async (_, { email, password }) => {
      const [rows] = await db.query("SELECT * FROM user WHERE email = ?", [email]);
      const user = rows[0];

      if (!user) throw new GraphQLError("Email tidak ditemukan");

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) throw new GraphQLError("Password salah");

      return user;
    },

    createTrip: async (_, { user_id, title, location, remarks, start_date, end_date }) => {
      const [result] = await db.query(
        "INSERT INTO trip (user_id, title, location, remarks, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)",
        [user_id, title, location, remarks, start_date, end_date]
      );

      return {
        id: result.insertId,
        user_id,
        title,
        location,
        remarks,
        start_date,
        end_date,
      };
    },

    updateTrip: async (_, { id, title, location, remarks, start_date, end_date }) => {
      const [rows] = await db.query("SELECT * FROM trip WHERE id = ?", [id]);
      const trip = rows[0];
      if (!trip) throw new Error("Trip not found");

      const newTitle = title ?? trip.title;
      const newLocation = location ?? trip.location;
      const newRemarks = remarks ?? trip.remarks;
      const newStartDate = start_date ?? trip.start_date;
      const newEndDate = end_date ?? trip.end_date;

      await db.query(
        "UPDATE trip SET title = ?, location = ?, remarks = ?, start_date = ?, end_date = ? WHERE id = ?",
        [newTitle, newLocation, newRemarks, newStartDate, newEndDate, id]
      );

      return {
        id,
        user_id: trip.user_id,
        title: newTitle,
        location: newLocation,
        remarks: newRemarks,
        start_date: newStartDate,
        end_date: newEndDate,
      };
    },

    deleteTrip: async (_, { id }) => {
      const [result] = await db.query("DELETE FROM trip WHERE id = ?", [id]);
      return result.affectedRows > 0;
    },

    createDreamDestination: async (_, { user_id, name, image }) => {
      const [result] = await db.query(
        "INSERT INTO dream_trip (user_id, name, image) VALUES (?, ?, ?)",
        [user_id, name, image]
      );

      return {
        id: result.insertId,
        user_id,
        name,
        image,
      };
    },

    updateDreamDestination: async (_, { id, name, image }) => {
      const [rows] = await db.query("SELECT * FROM dream_trip WHERE id = ?", [id]);
      const dest = rows[0];
      if (!dest) throw new Error("Dream destination not found");

      const newName = name ?? dest.name;
      const newImage = image ?? dest.image;

      await db.query(
        "UPDATE dream_trip SET name = ?, image = ? WHERE id = ?",
        [newName, newImage, id]
      );

      return {
        id,
        user_id: dest.user_id,
        name: newName,
        image: newImage,
      };
    },

    deleteDreamDestination: async (_, { id }) => {
      const [result] = await db.query("DELETE FROM dream_trip WHERE id = ?", [id]);
      return result.affectedRows > 0;
    },

    forgotPassword: async (_, { email }) => {
      const [rows] = await db.query("SELECT * FROM user WHERE email = ?", [email]);
      const user = rows[0];

      if (!user) {
        throw new GraphQLError("Email tidak ditemukan");
      }

      console.log(`Simulasi: Mengirim email reset password ke ${email}`);

      return "Link reset password berhasil dikirim ke email kamu.";
    },

    resetPassword: async (_, { email, password }) => {
        const [rows] = await db.query("SELECT * FROM user WHERE email = ?", [email]);
        const user = rows[0];

        if (!user) {
          throw new GraphQLError("Email tidak ditemukan");
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await db.query("UPDATE user SET password = ? WHERE email = ?", [
          hashedPassword,
          email,
        ]);

        return "Password berhasil diperbarui.";
      },
  },

  Trip: {
    start_date: (trip) => new Date(trip.start_date).toISOString(),
    end_date: (trip) => new Date(trip.end_date).toISOString(),
  },
};

module.exports = resolvers;
