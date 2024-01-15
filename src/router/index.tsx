import DefaultLayout from "../layouts/DefaultLayout";
import ChatPage from "../pages/ChatPage";
import HomePage from "../pages/HomePage";
import CustomizationStartPage from "../pages/start-pages/CustomizationStartPage.tsx";
import PresetStartPage from "../pages/start-pages/PresetStartPage.tsx";
import EditChatPage from "@/pages/EditChatPage.tsx";
import ImportStartPage from "@/pages/start-pages/ImportStartPage.tsx";
import { createBrowserRouter, ScrollRestoration } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "/new-chat/presets",
        element: <PresetStartPage />,
      },
      {
        path: "/new-chat/existing-chats",
        element: <ImportStartPage />,
      },
      {
        path: "/new-chat/customization",
        element: <CustomizationStartPage />,
      },
      {
        path: "/chats/:id",
        element: (
          <>
            <ScrollRestoration />
            <ChatPage />
          </>
        ),
      },
      {
        path: "/chats/:id/edit",
        element: <EditChatPage />,
      },
    ],
  },
]);

export default router;
