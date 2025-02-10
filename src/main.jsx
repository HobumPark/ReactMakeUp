import React from 'react'
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import SignIn from './routes/SignIn/SignIn.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import UserManagement from './routes/UserManagement/UserManagement.jsx';
import ProgramManagement from './routes/ProgramManagement/ProgramManagement.jsx';
import CodeManagement from './routes/CodeManagement/CodeManagement.jsx';
import AuthorityManagement from './routes/AuthorityManagement/AuthorityManagement.jsx';
import GroupManagement from './routes/GroupManagement/GroupManagement.jsx';
import ProtectedRoutes from './components/ProtectedRoute/ProtectedRoute.jsx';
import "./utils/i18n.js";


const queryClient = new QueryClient();

const router = createBrowserRouter([
   {
     path:"/",
     element: <SignIn></SignIn>
   },
   {
    path: "system-management",
    element: <ProtectedRoutes />, 
    children: [
      {
        path: "user",
        element: <UserManagement></UserManagement>,
      },
      {
        path: "program",
        element: <ProgramManagement></ProgramManagement>,
      },
      {
        path: "code",
        element: <CodeManagement></CodeManagement>,
      },
      {
        path: "authority",
        element: <AuthorityManagement></AuthorityManagement>,
      },
      {
        path: "group",
        element: <GroupManagement></GroupManagement>,
      },
    ],
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