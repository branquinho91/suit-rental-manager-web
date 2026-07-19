# 👔 Suit Rental Manager

<p align="center">
  A clean and practical web dashboard for managing customers, products, inventory, and suit rentals.
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img alt="React Router" src="https://img.shields.io/badge/React_Router-7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" />
</p>

<p align="center">
  <a href="#-about">About</a> •
  <a href="#-features">Features</a> •
  <a href="#-getting-started">Getting started</a> •
  <a href="#-api-integration">API</a> •
  <a href="#-project-structure">Structure</a>
</p>

## ✨ About

**Suit Rental Manager** is the front-end of a rental management system built for formalwear businesses. It brings the day-to-day operation into one place, making it easier to register customers and products, track individual inventory items, and follow each rental through its lifecycle.

The application is a single-page app and communicates with a REST API for all business data.

## 🚀 Features

- **Customer management** — register customers and quickly search by name, CPF, email, phone number, or city.
- **Product catalog** — create products with type, brand, size, color, price, and additional details.
- **Inventory control** — register physical items, track unique codes, and monitor availability and status.
- **Rental workflow** — create rentals, inspect their details, and mark them as completed or canceled.
- **Fast filtering** — find products, stock items, customers, and rentals from their respective screens.
- **Clear UI states** — dedicated loading, empty, no-results, and error feedback throughout the app.
- **SPA-ready deployment** — routing and security headers are configured for Vercel.

## 🛠️ Tech stack

| Technology | Purpose |
| --- | --- |
| [React](https://react.dev/) | Component-based user interface |
| [TypeScript](https://www.typescriptlang.org/) | Static typing and safer development |
| [Vite](https://vite.dev/) | Development server and production build |
| [React Router](https://reactrouter.com/) | Client-side navigation |
| [ESLint](https://eslint.org/) | Code quality and consistency |

## 🏁 Getting started

### Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) — use a current LTS release
- [npm](https://www.npmjs.com/)
- A compatible Suit Rental Manager REST API running locally or available remotely

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/branquinho91/suit-rental-manager-web.git
   cd suit-rental-manager-web
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Configure the API connection using one of the options in the [API integration](#-api-integration) section.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL shown by Vite in your browser.

## 🔌 API integration

The app requires a REST API. Requests use the URL defined in `VITE_API_URL`; when it is not set, they use the local `/api` proxy.

### Option 1 — local API

Run the backend at `http://localhost:8080` and start the front-end without creating an `.env` file. Vite will proxy `/api` requests to the local server during development.

### Option 2 — remote API

Copy the example environment file:

```bash
cp .env.example .env
```

Then update the value with your API URL:

```env
VITE_API_URL=https://your-api.example.com
```

> [!IMPORTANT]
> Do not add a trailing slash to `VITE_API_URL`. If you use an ngrok URL, the client automatically sends the header required to skip ngrok's browser warning page.

### Expected endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/customers` | List customers |
| `POST` | `/customers` | Create a customer |
| `GET` | `/products` | List products |
| `POST` | `/products` | Create a product |
| `GET` | `/inventory-items` | List inventory items |
| `POST` | `/inventory-items` | Add an inventory item |
| `GET` | `/rentals` | List rentals |
| `POST` | `/rentals` | Create a rental |
| `PATCH` | `/rentals/:id/complete` | Complete a rental |
| `PATCH` | `/rentals/:id/cancel` | Cancel a rental |

## 📜 Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Type-checks the project and creates a production build |
| `npm run lint` | Runs ESLint across the project |
| `npm run preview` | Serves the production build locally for inspection |

## 📁 Project structure

```text
suit-rental-manager-web/
├── public/                 # Static public assets
├── src/
│   ├── components/        # Shared UI, cards, buttons, and modals
│   ├── img/               # Image assets
│   ├── pages/             # Main application screens
│   ├── services/          # API client and domain services
│   ├── types/             # TypeScript domain and API types
│   ├── utils/             # Formatting and business helpers
│   ├── App.tsx            # Routes and application layout
│   ├── index.css          # Global styles
│   └── main.tsx           # Application entry point
├── .env.example           # Environment variable example
├── vercel.json            # Vercel SPA and security configuration
└── vite.config.ts         # Vite and local proxy configuration
```

## 🧭 Application routes

| Route | Screen |
| --- | --- |
| `/` | Home |
| `/customers` | Customer management |
| `/products` | Product catalog |
| `/inventory` | Inventory control |
| `/rentals` | Rental management |

## 📦 Production build

Create an optimized build with:

```bash
npm run build
```

The generated files will be available in `dist/`. You can inspect them locally with:

```bash
npm run preview
```

The included `vercel.json` redirects application routes to `index.html`, allowing React Router URLs to work correctly when deployed to Vercel.

## 🤝 Contributing

Contributions are welcome. To suggest an improvement:

1. Fork the repository.
2. Create a branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m "feat: add your feature"`.
4. Push the branch: `git push origin feature/your-feature`.
5. Open a pull request.

---

<p align="center">
  Built with React, TypeScript, and a sharp eye for rental operations. ✨
</p>
