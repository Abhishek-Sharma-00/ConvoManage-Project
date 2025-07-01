const cron = require("node-cron");
const Session = require("../models/Session");
const User = require("../models/User");
const sendEmail = require("./sendEmail");

const scheduleReminders = () => {
  // Run every minute
  cron.schedule("* * * * *", async () => {
    console.log("Checking for session reminders...");

    const now = new Date();

    try {
      const upcomingSessions = await Session.find({
        startTime: { $gte: now },
      })
        .populate("attendees")
        .populate("speaker");

      for (const session of upcomingSessions) {
        const reminderMinutes = session.reminderMinutesBefore || 30;
        const reminderTime = new Date(session.startTime.getTime() - reminderMinutes * 60000);

        const diff = Math.abs(now.getTime() - reminderTime.getTime());

        // Fire reminder if within 1 minute of scheduled reminder time
        if (diff <= 60000) {
          const lastSent = session.lastReminderSentAt;
          
          // Prevent duplicate reminder within the past 1 hour
          if (lastSent && (now - lastSent) < 60 * 60 * 1000) {
            console.log(`Skipping duplicate reminder for: ${session.title}`);
            continue;
          }

          const subject = `Reminder: ${session.title}`;
          const sessionTime = new Date(session.startTime).toLocaleTimeString();
          const message = `Don't forget your session "${session.title}" starts at ${sessionTime}.`;

          for (const attendee of session.attendees) {
            await sendEmail(attendee.email, subject, `Hi ${attendee.name},\n\n${message}`);
          }

          if (session.speaker?.email) {
            await sendEmail(session.speaker.email, subject, `Hi ${session.speaker.name},\n\n${message}`);
          }
          await logActivity(speaker._id, `Reminder sent for session: ${session.title}`);

          console.log(`Sent reminder for: ${session.title}`);
        }
      }
    } catch (err) {
      console.error("Reminder Cron Error:", err.message);
    }
  });
};

module.exports = scheduleReminders;

