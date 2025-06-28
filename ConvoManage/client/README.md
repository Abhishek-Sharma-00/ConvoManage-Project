# 🎨 ConvoManage - Frontend Client

ConvoManage is a full-featured platform to manage online conferences, built using **React.js**. It includes role-based dashboards, registration & login, session management, reminder notifications, analytics, and much more.

This `client/` folder is the React frontend that interacts with the Node.js backend via RESTful APIs.

---

## 🚀 Features

1. Role-based login: **Attendee**, **Speaker**, **Organizer**, **Admin**  
2. User registration with dynamic role selection  
3. Organizer dashboard: create conferences, sessions, assign speakers  
4. Speaker dashboard: view assigned sessions  
5. Attendee dashboard: browse & join sessions  
6. Email reminders for upcoming sessions  
7. Admin dashboard: manage users, roles, and view analytics  
8. Admin analytics with bar and pie charts  
9. Activity log viewer for audit tracking  
<!-- Fully responsive UI with modern design -->

---

## 📦 Tech Stack

- **React** (frontend)
- **Axios** (API calls)
- **React Router** (navigation)
- **Context API** (authentication)
- **Chart.js / Recharts** (analytics visualizations)
- **CSS / Tailwind** (styling)
- **FullCalendar** or **React Calendar** (optional: session view)

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
            |    |     ├── ProtectedRoute.jsx
            │    ├── context/ # Auth context
            |    |     ├── AuthContext.jsx
            │    ├── pages/ # All route pages (login, dashboards, etc.)
            |    |     ├── Login.jsx
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