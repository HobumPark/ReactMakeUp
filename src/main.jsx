import React from 'react'
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useTranslation } from "react-i18next";
import Layout from './components/Layout/Layout.jsx';

import Home from './routes/Home/Home.jsx';
import Search from './routes/Search/Search.jsx';
import Display from './routes/Display/Display.jsx';
import "./utils/i18n.js";

//https://www.amoremall.com/kr/ko/display/main

const queryClient = new QueryClient();

const router = createBrowserRouter([
   {
     path:"/",
     element:<Layout/>,
     children: [
      {
        path: "",
        element: <Home/>,
      },
      {
        path: "/search",
        element: <Search/>,
      },
      ,
      {
        path: "/display",
        element: <Display/>,
      }
    ]
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