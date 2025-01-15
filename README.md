# ToDo Application

An open-source task management application built using Next.js 14, offering a seamless and modern experience for creating, managing, sharing, and collaborating on tasks.

---

## 🚀 Features

### 🔐 User Authentication & Registration
- Secure sign-up and login with a username and password.
- Role-based access control.

### ✅ Task Management
- Add tasks with fields like Title, Description, Due Date, and Status (Done/Pending).
- Edit and delete tasks with ease.
- Filter and search tasks by title or description.

### 🔗 Task Sharing
- Share tasks via unique URLs for easy collaboration.
- No registration required to access shared tasks.

### 💬 Comments
- Add and view comments on tasks for streamlined communication.
- Ideal for collaborative projects.

### 🛠️ GitHub Repository Integration
- Link tasks to public GitHub repositories.
- View metadata such as stars, forks, and contributors directly in the application.

### 🎨 Modern UI/UX
- Sleek, mobile-responsive design powered by Shadcn-UI and Tailwind CSS.
- Fast page loads and smooth navigation across devices.

---

## 🛠️ Technology Stack

| Technology       | Purpose                                                                 |
|------------------|-------------------------------------------------------------------------|
| **Next.js 14**   | Framework with App Router and Server Actions.                          |
| **Prisma ORM**   | Simplifies database interaction.                                       |
| **NeonDB**       | Cloud-based Postgres database.                                         |
| **Shadcn-UI**    | Pre-styled, customizable UI components.                                |
| **Tailwind CSS** | Utility-first CSS framework for responsive design.                     |
| **React-Hook-Form** | Efficient form handling.                                            |
| **Zod**          | Form validation and API schema validation.                             |
| **TypeScript**   | Ensures type-safe development.                                         |
| **Vercel**       | Fast, scalable deployment platform.                                    |

---

## 🧩 System Architecture

### Frontend
- Built with Next.js 14 to deliver SSR (Server-Side Rendering) and SSG (Static Site Generation).
- Components styled with Tailwind CSS and designed using Shadcn-UI.
- Client-side state management via react-hook-form.

### Backend
- Implemented using Next.js API Route Handlers and Server Actions.
- Ensures secure, efficient data handling.

### Database
- NeonDB hosts the PostgreSQL database.
- Prisma ORM manages schema migrations, database queries, and relations.

### Validation
- Zod validates forms and API responses to ensure data integrity.

### Deployment
- Hosted on Vercel, ensuring fast global delivery.

---

## 📈 Future Scope

- **Real-Time Collaboration:** Implement WebSockets for real-time task updates and multi-user edits.
- **Task Progress Tracking:** Visualize task progress using charts and dashboards.
- **Notifications System:** Integrate email and push notifications for task reminders and updates.
- **Dark Mode:** Add a dark theme for better usability during late hours.
- **AI-Powered Insights:** Provide task prioritization suggestions and productivity insights.

---

## 💾 Database Schema

### Database Tables
| Table Name     | Description                                    |
|----------------|------------------------------------------------|
| **users**      | Stores user data (username, email, password). |
| **tasks**      | Contains task details (title, description, due date, status). |
| **comments**   | Holds comments associated with specific tasks. |
| **github_links** | Stores GitHub repository links and fetched metadata. |

### Key Features
- Relational structure for secure and efficient data management.
- Prisma ORM simplifies schema migrations and querying.

---

## 📚 Conclusion

The ToDo Application is a robust, scalable, and user-friendly platform for modern task management. By leveraging Next.js 14, Prisma ORM, and advanced UI components, it ensures a seamless experience for individuals and teams alike.

Future updates like real-time collaboration, AI-powered insights, and enhanced progress tracking aim to make it an indispensable productivity tool.

---

## 🌐 Live Demo
[Check out the live application here](https://todo-indol-five.vercel.app/)

---

## 🛠️ Getting Started

### Prerequisites
- Node.js v16+
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Jeevansm_25/todo-application.git
   cd todo-application
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory and configure database credentials.
4. Run the development server:
   ```bash
   npm run dev
   ```

### Deployment
- Deploy easily on Vercel using the Vercel CLI or Dashboard.

---

## 👥 Contributors

Feel free to fork the project and contribute to it. Submit a pull request with any improvements or fixes!

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
