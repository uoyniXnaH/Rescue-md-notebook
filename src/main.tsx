import ReactDOM from "react-dom/client";
import App from "./App";
import './i18n';

import { ModalProvider } from "./components/Modal";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <ModalProvider>
        <App />
    </ModalProvider>
);
