const cron = require('node-cron');
const db = require('../db/mysql');
const { sendNotificationToUser } = require('./websocketServer');

cron.schedule('0 9 * * *', async () => {
  const today = new Date();
  const targetDate = new Date();
  targetDate.setDate(today.getDate() + 3); // H-3

  try {
    const [rows] = await db.query(`
      SELECT t.*, u.id AS user_id, u.nama FROM trip t
      JOIN user u ON t.user_id = u.id
      WHERE DATE(t.start_date) = DATE(?)
    `, [targetDate]);

   rows.forEach((trip) => {
  const message = {
    title: trip.title,
    location: trip.location,
    startDate: trip.start_date,
    endDate: trip.end_date,
  };

  sendNotificationToUser(trip.user_id, message);
});

    console.log(`[CRON] Notifikasi H-3 dikirim ke ${rows.length} user`);
  } catch (error) {
    console.error('[CRON] Gagal mengirim notifikasi:', error.message);
  }
});
