# MyFinTech - Finance Management App for Manufacturing Businesses

[MyFinTech](https://myfintech.vercel.app) is a comprehensive finance management application tailored for manufacturing businesses in Indonesia. This app helps businesses manage their finances efficiently, providing tools for transaction management, debt tracking, receivables management, and financial reporting. With integration to **Supabase** for backend/database, MyFint offers real-time financial calculations and seamless user experience.

## Features

- **Chart of Accounts (COA):** Manage your accounts with unique codes and descriptions for all financial categories.
- **Transaction Management:** Record income and expenses, link them to your accounts, and keep track of all financial activities.
- **Debt Tracking:** Monitor outstanding debts (utang) and receivables (piutang) with payment statuses and aging reports.
- **Bank Account Management:** Manage multiple bank accounts and track balances, deposits, and withdrawals.
- **Auto Calculations:** Real-time computation of balances, cash flow, and taxes.
- **Tax Reporting:** Generate tax reports such as PPN, PPh 21/23/25, and tax withholding summaries.
- **User Management:** Manage user profiles and set up role-based access (Administrator, Management).
- **Financial Reports:** Filter daily, weekly, and monthly reports, including income, expenses, and cash flow.
- **Integrated Inventory System:** Connect to inventory system using API Key.
- **Calendar View:** View all financial activities in an interactive calendar.
- **Visual Financial Graphs:** Analyze financial performance with monthly and yearly graphs.
- **Secure Password Management:** Ensure secure password updates and reset mechanisms.

## Technologies Used

- **Frontend:** Vite + React (with Tailwind CSS for styling)
- **Backend:** Supabase (PostgreSQL, Authentication, and Storage)
- **Deployment:** Vercel

## Deployment

You can view the live version of the app at:  
[https://myfint.vercel.app](https://myfintech.vercel.app)

## Installation

To run this project locally, follow the steps below:

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/myfint.git
cd myfint
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root of the project and add your **Supabase** credentials. You can find them in the Supabase dashboard under your project settings.

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run the development server

```bash
npm run dev
```

This will start the development server. Open your browser and go to [http://localhost:3000](http://localhost:3000) to view the application.

## Supabase Integration

This project is integrated with **Supabase**, which provides real-time database functionality, user authentication, and file storage.

### Setting up Supabase:

1. Create a new project on [Supabase](https://supabase.io).
2. Set up your database tables (Accounts, Transactions, etc.) according to the schema defined in the project.
3. Obtain the **Supabase URL** and **anon key** from your Supabase dashboard.
4. Add these keys to your `.env` file as mentioned in the Installation step.

## Usage

- **Admin Dashboard:** Provides full access to all features such as adding new accounts, creating transactions, managing users, and generating reports.
- **Management Dashboard:** Limited access to viewing reports and monitoring financial activities.
- **User Profile Management:** Users can update their profiles, set passwords, and manage their login credentials securely.

## Contributing

Contributions are welcome! If you'd like to contribute to the project, please follow these steps:

1. Fork this repository
