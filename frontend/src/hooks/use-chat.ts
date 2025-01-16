function useChatPopup() {
    const popup = document.getElementById("freechatpopup") as HTMLDivElement;
    const mailButton = document.getElementById("freechat-popup-notinput-button") as HTMLAnchorElement;
    const nameH1 = document.getElementsByClassName("freechat-popup-top")[0].children[1];
    const message = document.getElementsByClassName("freechat-popup-content")[0].children[1];
    const popupInfo = document.getElementsByClassName("freechat-bottom")[0].children[0];
    const toggleButton = document.getElementsByClassName("freechat-bottom")[0].children[1] as HTMLInputElement

    const setInnerHtml = (element: Element) => {
        return (html: string) => {
            element.innerHTML = html;
        };
    }

    return [popup, mailButton, setInnerHtml(nameH1), setInnerHtml(message), setInnerHtml(popupInfo), toggleButton] as const;
}

export function showChatPopupStudent({
    lessonTitle,
    email,
    fullName
}: {
    lessonTitle: string;
    email: string;
    fullName: string
}) {
    console.warn("Showing popup");

    if (!lessonTitle || !email || !fullName) {
        console.error("Missing arguments");
        console.log("Got: ", {
            lessonTitle,
            email,
            fullName
        });
        return;
    }

    const[popup, mailButton, setTeacherNameH1, setTeacherMessage, setPopupInfo, toggleButton] = useChatPopup();

    popup.classList.add("visible");
    mailButton.innerHTML = "Chat with " + fullName;
    setTeacherNameH1(fullName);
    setTeacherMessage("Hi, contact me on my email and we'll arrange the details of " + lessonTitle);
    setPopupInfo("Contact " + fullName);

    mailButton.onclick = () => {
        popup.classList.remove("visible");
        setTeacherNameH1("");
        setTeacherMessage("");
        setPopupInfo("");
        toggleButton.click();
    };
}