import "./App.css";
import router from "./router";
import { ReactElement } from "react";
import { RouterProvider } from "react-router-dom";

function App(): ReactElement {
  return <RouterProvider router={router} />;
}

export default App;
