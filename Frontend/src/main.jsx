import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Protected from "./Protected.jsx";
import Chat from "./Components/Chat/Chat.jsx";
import Signup from "./Components/Signup/Signup.jsx";
import { UserContextProvider } from "./context.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <Signup />
      </div>
    ),
  },
  {
    path: "protected",
    element: <Protected />,
    children: [
      {
        path: "chat",
        element: <Chat />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  </React.StrictMode>
);
