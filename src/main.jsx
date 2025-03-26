import React from 'react'
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// dashboard
import MainDashboard from './routes/MainDashboard/MainDashboard.jsx';
// dashboard
import "./utils/i18n.js";

const queryClient = new QueryClient();

const router = createBrowserRouter([
   {
     path:"/",
     element: <MainDashboard></MainDashboard>
   },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);