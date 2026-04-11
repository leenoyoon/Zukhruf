import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { CustomThemeProvider } from "./shared/theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <CustomThemeProvider>
      <ToastContainer theme="colored" position="top-right" />
      <RouterProvider router={router} />
    </CustomThemeProvider>
  );
}

export default App;
