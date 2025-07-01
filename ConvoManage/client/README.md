# 🎨 ConvoManage - Frontend Client

ConvoManage is a full-featured platform to manage online conferences, built using **React.js**. It includes role-based dashboards, registration & login, session management, reminder notifications, analytics, and much more.

This `client/` folder is the React frontend that interacts with the Node.js backend via RESTful APIs.

---

## 🚀 Features

* Authentication (Register/Login)
* Landing Page
* Role-based Dashboards:

  * **Admin**: Manage users, analytics, activity logs
  * **Organizer**: Create conferences, add sessions, assign speakers
  * **Speaker**: View assigned sessions
  * **Attendee**: Register for sessions and view them in calendar
* Calendar view of sessions (FullCalendar)
* Reminder System (set by organizers)
* Admin Analytics (charts, user/session insights)

---
## ⚙️ Installation

```bash
# 1. Clone the project
https://github.com/your-username/ConvoManage-Project

# 2. Navigate into client folder
cd ConvoManage/client

# 3. Install dependencies
npm install

# 4. Run the development server
npm start


App runs at `http://localhost:3000`
```

---

## 📁 Project Structure for frontend

```
ConvoManage/
    └── client/
            ├── public/
            |    ├── index.html
            │    └── manifest.json
            ├── src/
            │    ├── components/ # Navbar, charts, etc.
            |    |     ├── Navbar.jsx
            |    |     └── ProtectedRoute.jsx
            │    ├── context/ # Auth context
            |    |     ├── AuthContext.jsx
            │    ├── pages/ # All route pages (login, dashboards, etc.)
            |    |     ├── AdminAnalytics.jsx
            |    |     ├── AttendeeDashboard.jsx
            |    |     ├── AdminDashboard.jsx
            |    |     ├── home.css
            |    |     ├── Home.jsx
            |    |     ├── Login.jsx
            |    |     ├── MySession.jsx
            |    |     ├── OrganizerDashboard.jsx
            |    |     ├── Register.jsx
            |    |     ├── SpeakerDashboard.jsx
            │    ├── App.js
            │    ├── index.css
            │    ├── index.js
            │    └── styles.css
            ├── .gitignore
            ├── package-lock.json
            └── package.json

```


---

## 📦 Tech Stack

- **React** (frontend)
- **Axios** (API calls)
- **React Router** (navigation)
- **Context API** (authentication)
- **Chart.js / Recharts** (analytics visualizations)
- **CSS** (styling)
- **FullCalendar** or **React Calendar** (optional: session view)

---

## 🔍 Routing Overview

| Route Path         | Description              |
| ------------------ | ------------------------ |
| `/`                | Home / Landing Page      |
| `/login`           | User login               |
| `/register`        | User registration        |
| `/attendee`        | Attendee Dashboard       |
| `/speaker`         | Speaker Dashboard        |
| `/organizer`       | Organizer Dashboard      |
| `/admin`           | Admin Dashboard          |
| `/admin/analytics` | Admin Analytics & Charts |
| `/calendar`        | Session Calendar View    |

---

## 🔒 Role-Based Access

| Role      | Access                                      |
| --------- | ------------------------------------------- |
| Attendee  | View sessions, register                     |
| Speaker   | View assigned sessions                      |
| Organizer | Create conferences, sessions, set reminders |
| Admin     | Manage users, roles, analytics, logs        |

---

## 📊 Admin Analytics Dashboard

Includes:

* Total user count by role
* Total conferences
* Total sessions
* Most active speakers
* Pie and Bar charts

---

## ⏰ Reminder System

* Organizer can set reminder timing per session
* Email sent to all attendees and speakers
* Options: 15 / 30 / 60 minutes before

---

## 🕵️ Activity Logs

* Tracks login, registration, session reminders, etc.
* Viewable by admins in dashboard

---

## 📦 Main Dependencies

* `react`
* `react-router-dom`
* `axios`
* `chart.js`, `react-chartjs-2`
* `@fullcalendar/react`

---

## 🖼️ Screenshots

I will do it later.

---

## 👤 Author

**Abhishek Kumar Sharma**
Email: [abhisheksart0@gmail.com](mailto:abhisheksart0@gmail.com)
GitHub: [@Abhishek-Sharma-00](https://github.com/Abhishek-Sharma-00)

---

## 🔐 License

This project is for educational purposes. You can use and modify it freely.

---
