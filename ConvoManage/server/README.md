# 📡 ConvoManage - Backend Server

ConvoManage is an all-in-one platform for managing online conferences, speakers, and attendees.

This repository contains the backend server powered by **Node.js**, **Express**, and **MongoDB**. It handles authentication, session/conference management, email reminders, role-based dashboards, activity logging, admin analytics, and more.

---

## 📁 Project Structure
```
server/
    |---controllers/ # Route logic
    |    |----authController.js    
    |---models/ # Mongoose models
    |    |----User.js
    |---routes/ # API route definitions
    |    |----auth.js
    |---middlewares/ # JWT auth & role-based access control
    |    |----authMiddleware.js

```