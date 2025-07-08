const cron = require("node-cron");
const Session = require("../models/Session");
// const User = require("../models/User");
const sendEmail = require("./sendEmail");
const logActivity = require("./logActivity");
const logoUrl = "https://raw.githubusercontent.com/Abhishek-Sharma-00/ConvoManage-Project/refs/heads/main/ConvoManage/client/public/logo.jpg";

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
        const reminderTime = new Date(
          session.startTime.getTime() - reminderMinutes * 60000
        );

        const diff = Math.abs(now.getTime() - reminderTime.getTime());

        // Fire reminder if within 1 minute of scheduled reminder time
        if (diff <= 60000) {
          const lastSent = session.lastReminderSentAt;

          // Prevent duplicate reminder within the past 1 hour
          if (lastSent && now - lastSent < 60 * 60 * 1000) {
            console.log(`Skipping duplicate reminder for: ${session.title}`);
            continue;
          }

          const subject = `Reminder: ${session.title}`;
          const sessionTime = new Date(session.startTime).toLocaleTimeString();
          const message = `Don't forget your session "${session.title}" starts at ${sessionTime}.`;

          for (const attendee of session.attendees) {
            const htmlAttendee = `
              <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
                <div style="text-align: center;">
                  <img src="${logoUrl}" alt="ConvoManage" style="max-width: 200px;" />
                </div>
                <h2 style="color: #333;">Hello ${attendee.name},</h2>
                <p>Don't forget your session <strong>"${session.title}"</strong> starts at <strong>${sessionTime}</strong>.</p>
                <p style="margin-top: 20px;">You’re receiving this reminder because you registered for this session on ConvoManage.</p>
                <hr style="margin: 20px 0;" />
                <p style="font-size: 12px; color: #888;">
                  <a href="https://convomanage.com/unsubscribe" style="color: #888;">Unsubscribe</a> |
                  <a href="https://convomanage.com/feedback" style="color: #888;">Give Feedback</a>
                </p>
              </div>
            `;

            await sendEmail(
              attendee.email,
              subject,
              message,
              htmlAttendee
            );
          }

          if (session.speaker?.email) {
            const htmlSpeaker = `
              <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
                <div style="text-align: center;">
                  <img src="${logoUrl}" alt="ConvoManage" style="max-width: 200px;" />
                </div>
                <h2 style="color: #333;">Hello ${session.speaker.name},</h2>
                <p>Don't forget your session <strong>"${session.title}"</strong> starts at <strong>${sessionTime}</strong>.</p>
                <p style="margin-top: 20px;">You’re receiving this reminder because you registered for this session on ConvoManage.</p>
                <hr style="margin: 20px 0;" />
                <p style="font-size: 12px; color: #888;">
                  <a href="https://convomanage.com/unsubscribe" style="color: #888;">Unsubscribe</a> |
                  <a href="https://convomanage.com/feedback" style="color: #888;">Give Feedback</a>
                </p>
              </div>
            `;

            await sendEmail(
              session.speaker.email,
              subject,
              message,
              htmlSpeaker
            );
          }
          await logActivity(
            session.speaker?._id,
            `Reminder sent for session: ${session.title}`
          );

          console.log(`Sent reminder for: ${session.title}`);
        }
      }
    } catch (err) {
      console.error("Reminder Cron Error:", err.message);
    }
  });
};

module.exports = scheduleReminders;


// const html = `
//   <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
//     <div style="text-align: center;">
//       <img src="${logoUrl}" alt="ConvoManage" style="max-width: 200px;" />
//     </div>
//     <h2 style="color: #333;">Hello ${session.speaker.name},</h2>
//     <p>Don't forget your session <strong>"${session.title}"</strong> starts at <strong>${sessionTime}</strong>.</p>
//     <p style="margin-top: 20px;">You’re receiving this reminder because you registered for this session on ConvoManage.</p>
//     <hr style="margin: 20px 0;" />
//     <p style="font-size: 12px; color: #888;">
//       <a href="https://convomanage.com/unsubscribe" style="color: #888;">Unsubscribe</a> |
//       <a href="https://convomanage.com/feedback" style="color: #888;">Give Feedback</a>
//     </p>
//   </div>
// `;

// await sendEmail(attendee.email, subject, html);