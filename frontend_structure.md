# Frontend Structure Approach 🎨

The frontend of **Exam Battle** is a modern **Next.js** application utilizing the **App Router** and **Redux Toolkit**. The structure is designed for scalability and performance.

## 📂 Folder Overview

```tree
app/                       # Next.js App Router (Routes & Layouts)
├── (auth)/                # Authentication routes (login, register)
├── layout.tsx             # Root layout with providers
└── page.tsx               # Landing/Home page
components/                # Reusable UI components
├── home/                  # Feature-specific components for Home
├── ui/                    # Generic UI components (buttons, inputs)
└── provider/              # Context & Store providers
redux/                     # State Management (RTK Query)
├── features/              # API Slices and Reducers
├── baseApi.ts             # Base API configuration
└── store.ts               # Redux Store configuration
lib/                       # Third-party library configurations
config/                    # Global constants and env config
public/                    # Static assets (images, icons)
```

## 🧠 State Management (Redux & RTK Query)

We use **Redux Toolkit** for client-side state and **RTK Query** for server-side state (API caching and fetching).

- **`baseApi.ts`**: The single source of truth for all API calls, handling authentication headers and base URLs.
- **`features/`**: Contains specific API slices for different domains (e.g., `authApi`, `battleApi`).

## 🧱 Component Strategy

- **`components/ui`**: Atomic components (buttons, modals, inputs) that are reused across the whole app.
- **`components/feature-name`**: Specific components that belong to a particular page or feature (e.g., `BattleLobby` inside `components/home`).
- **`app/`**: Focused on routing and layout. Most logic is decoupled into components or hooks.

## 🚀 Key Philosophies

- **Responsive Design**: Mobile-first approach using Tailwind CSS.
- **Real-time Integration**: Socket.io hooks integrated directly with components to reflect battle state changes.
- **Form Handling**: Consistent form patterns (using React Hook Form or standard state) with validation.
- **Zero-Flicker**: Leveraging Next.js Server Components where possible, while using Client Components for interactivity.
