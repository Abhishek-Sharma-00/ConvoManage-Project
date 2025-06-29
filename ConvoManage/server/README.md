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
            |     └── sessionController.js
            ├── middlewares/ # JWT auth & role-based access control
            |     ├── authMiddleware.js
            |     └── roleMiddleware.js 
            ├── models/ # Mongoose models
            |     ├── Conference.js
            |     ├── Session.js
            |     └── User.js
            ├── routes/ # API route definitions
            |     ├── admin.js
            |     ├── adminAnalytics.js
            |     ├── auth.js
            |     ├── conference.js
            |     ├── protected.js
            |     └── session.js
            ├── .env
            ├── .env.example
            ├── .gitignore
            ├── index.js
            ├── package-lock.json
            └── package.json
            
```