import { useEffect } from "react";

const ShareButtons = ({title}) => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://yastatic.net/share2/share.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    return (
        <div
            className="ya-share2"
            data-curtain
            data-size="s"
            data-services="telegram,whatsapp"
            data-title={title}
        ></div>
    );
};

export default ShareButtons;
