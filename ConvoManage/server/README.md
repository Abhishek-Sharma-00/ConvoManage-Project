# 📡 ConvoManage - Backend Server

ConvoManage is an all-in-one platform for managing online conferences, speakers, and attendees.

This repository contains the backend server powered by **Node.js**, **Express**, and **MongoDB**. It handles authentication, session/conference management, email reminders, role-based dashboards, activity logging, admin analytics, and more.

---

## 📁 Project Structure for backend
```

ConvoManage/
    └── server/
            ├── controllers/ # Route logic
            |     ├── authController.js 
            |     ├── conferenceController.js
            |     ├── passwordController.js
            |     └── sessionController.js
            ├── middlewares/ # JWT auth & role-based access control
            |     ├── authMiddleware.js
            |     ├── roleMiddleware.js 
            |     ├── sanitizeMiddleware.js 
            |     ├── validators.js 
            |     └── xssSanitizer.js 
            ├── models/ # Mongoose models
            |     ├── ActivityLog.js
            |     ├── Conference.js
            |     ├── Session.js
            |     └── User.js
            ├── routes/ # API route definitions
            |     ├── admin.js
            |     ├── adminAnalytics.js
            |     ├── auth.js
            |     ├── conference.js
            |     ├── profile.js
            |     ├── protected.js
            |     ├── session.js
            |     └── test.js
            ├── utils/
            |     ├── logActivity.js
            |     ├── reminderScheduler.js
            |     └── sendEmail.js
            ├── .env
            ├── .env.example
            ├── .gitignore
            ├── index.js
            ├── package-lock.json
            └── package.json
            
```