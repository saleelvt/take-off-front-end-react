import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";

import { App } from "./App";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { Provider } from "react-redux";
import { store } from "./reduxKit/store"; // ✅ import your store

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>  {/* ✅ Redux Provider wraps everything */}
      <ThemeProvider>
        <AppWrapper>
          <App />
        </AppWrapper>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
