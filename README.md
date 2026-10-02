# CLF Admin Panel

A professional React-based admin panel built with Vite, featuring authentication and a modern dashboard interface.

## Features

- 🔐 **Authentication System** - Secure login with JWT token management
- 📊 **Dashboard** - Clean and modern dashboard with statistics cards
- 🎨 **Professional UI** - Modern, responsive design with smooth animations
- 🔄 **Protected Routes** - Route protection with authentication checks
- 📱 **Responsive Design** - Mobile-friendly layout with collapsible sidebar
- ⚡ **Fast Development** - Built with Vite for lightning-fast HMR

## Demo Credentials

- **Email:** admin@clf.com
- **Password:** admin123

## Project Structure

```
clfAdmin/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── DashboardLayout.jsx
│   │   │   └── DashboardLayout.css
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Login/
│   │   │   ├── Login.jsx
│   │   │   └── Login.css
│   │   └── Dashboard/
│   │       └── Dashboard.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Backend API

The panel uses the Laravel + MySQL API (`Spaalita_backend`), by default at
`http://localhost:5000/api` (`start-server.bat` / `php artisan serve --port=5000`).
To use another address, copy `.env.example` to `.env` and set `VITE_API_BASE_URL`
(e.g. `http://localhost/spaalita/Spaalita_backend/public/api` with XAMPP Apache),
then restart `npm run dev`. Uploaded images (`/uploads/...`) are loaded from the
same server.

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## Technologies Used

- **React 18** - Latest version of React with hooks
- **React Router v6** - Client-side routing
- **Vite** - Next-generation frontend tooling
- **CSS3** - Modern styling with CSS variables

## Features Overview

### Authentication
- Context-based authentication management
- LocalStorage for session persistence
- Protected routes with automatic redirects
- Logout functionality

### Dashboard Layout
- Fixed sidebar navigation
- Responsive mobile menu
- Top navigation bar
- Statistics cards with animations
- Activity feed
- Quick action buttons

### UI Components
- Reusable layout components
- Professional form inputs
- Animated transitions
- Hover effects and shadows
- Modern color scheme

## Customization

### Colors
Edit CSS variables in `src/index.css`:
```css
:root {
  --primary-color: #4f46e5;
  --sidebar-bg: #1e293b;
  /* ... more variables */
}
```

### Navigation
Update menu items in `src/components/Layout/DashboardLayout.jsx`:
```javascript
const navItems = [
  // Add or modify navigation items
];
```

## License

MIT License - feel free to use this project for your own purposes.
