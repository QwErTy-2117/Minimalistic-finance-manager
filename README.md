# Minimalistic Finance Manager

A modern, minimalistic black-and-white personal finance manager built with React, Vite, and Tailwind CSS.

![Finance Manager Screenshot](assets/screenshots/dark%20mode/Screenshot%202026-01-09%20at%2018-12-23%20Finance%20Manager.png)

## Features

- **Dashboard**: Overview of total balance, recent transactions, and wallet distribution.
- **Multiple Wallets**: Create different wallets (Cash, Savings, Credit Card, etc.) with custom icons and colors.
- **Transaction Management**: Record deposits and withdrawals with optional descriptions.
- **Themes**: Toggle between high-contrast Dark and Light modes.
- **Balance Trends**: Monitor your financial growth with interactive charts (Weekly, Monthly, Yearly).
- **Data Persistence**: Automatic saving to browser `localStorage` plus manual JSON Import/Export.
- **Responsive Design**: Works on desktop and mobile.

## Prerequisites

- Node.js (v14 or higher recommended)
- npm (comes with Node.js)

## Getting Started

1.  **Install Dependencies**

    ```bash
    npm install
    ```

2.  **Run Development Server**

    Start the local development server with hot-reload:

    ```bash
    npm run dev
    ```

    Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

3.  **Build for Production**

    Create an optimized production build:

    ```bash
    npm run build
    ```

    The build artifacts will be stored in the `dist/` directory.

4.  **Preview Production Build**

    Locally preview the production build:

    ```bash
    npm run preview
    ```

## Technologies Used

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/) (for charts)
- [Lucide React](https://lucide.dev/) (for icons)
