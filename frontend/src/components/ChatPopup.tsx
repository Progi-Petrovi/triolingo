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
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://popupsmart.com/freechat.js";

        document.body.appendChild(script);

        const configScript = document.createElement("script");
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
        person: "${profileImageHash}",
        services: [{ name: "whatsapp", content: "${phoneNumber}" }, { name: "mail", content: "${email}" }],
      });
    `;
        document.body.appendChild(configScript);

        return () => {
            document.body.removeChild(script);
            document.body.removeChild(configScript);
            document.getElementById("freechatpopup")?.remove();
        };
    }, [phoneNumber, profileImageHash, email]);

    return null;
}
