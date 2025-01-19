import PathConstants from "@/routes/pathConstants";
import { useEffect } from "react";

type ChatPopupType = {
    phoneNumber: string;
    profileImageHash: string | null;
    email: string;
};

export default function ChatPopup({
    phoneNumber,
    profileImageHash,
    email,
}: ChatPopupType) {
    useEffect(() => {
        const scriptId = "freechat-js";
        const configId = "freechat-config";

        const existingScript = document.getElementById(scriptId);
        if (!existingScript) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.type = "text/javascript";
            script.src = "https://popupsmart.com/freechat.js";
            script.async = true;

            script.onload = () => {
                initializeChatPopup();
            };

            document.body.appendChild(script);
        } else {
            initializeChatPopup();
        }

        function initializeChatPopup() {
            const existingConfig = document.getElementById(configId);
            if (existingConfig) return;

            const configScript = document.createElement("script");
            configScript.id = configId;
            configScript.type = "text/javascript";
            configScript.innerHTML = `
              window.start.init({
                title: "Reach out to your teacher!",
                message: "Reach out to me to discuss our lesson!",
                color: "#4a044e",
                position: "right",
                placeholder: "Enter your message",
                withText: "Write with",
                viaWhatsapp: "Or write directly via Whatsapp",
                button: "Chat",
                device: "everywhere",
                logo: "https://d2r80wdbkwti6l.cloudfront.net/15O2wY0m63mnpnVJb7MZ4vnl99HjvJdQ.jpg",
                person: "${PathConstants.API_URL}/images/profile/${profileImageHash}",
                services: [
                  { name: "whatsapp", content: "${phoneNumber}" },
                  { name: "mail", content: "${email}" }
                ],
              });
            `;
            document.body.appendChild(configScript);
        }

        return () => {
            const script = document.getElementById(scriptId);
            const config = document.getElementById(configId);
            const popup = document.getElementById("freechatpopup");

            if (script) script.remove();
            if (config) config.remove();
            if (popup) popup.remove();
        };
    }, [phoneNumber, profileImageHash, email]);

    return null;
}
