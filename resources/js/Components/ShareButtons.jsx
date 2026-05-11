import { useEffect, useRef } from "react";

const SHARE_SCRIPT_ID = "yandex-share-script";
const SHARE_SCRIPT_SRC = "https://yastatic.net/share2/share.js";
let shareScriptPromise = null;

const loadYandexShareScript = () => {
    if (window.Ya?.share2) {
        return Promise.resolve();
    }

    if (shareScriptPromise) {
        return shareScriptPromise;
    }

    document.getElementById(SHARE_SCRIPT_ID)?.remove();

    shareScriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.id = SHARE_SCRIPT_ID;
        script.src = SHARE_SCRIPT_SRC;
        script.async = true;
        script.onload = () => {
            if (window.Ya?.share2) {
                resolve();
                return;
            }

            shareScriptPromise = null;
            script.remove();
            reject(new Error("Yandex share API is unavailable after script load"));
        };
        script.onerror = (error) => {
            shareScriptPromise = null;
            script.remove();
            reject(error);
        };
        document.body.appendChild(script);
    });

    return shareScriptPromise;
};

const ShareButtons = ({title}) => {
    const shareRef = useRef(null);

    useEffect(() => {
        const initShareWidget = () => {
            const element = shareRef.current;

            if (!element || !window.Ya?.share2) {
                return;
            }

            if (element.dataset.shareInitialized === "true" || element.querySelector(".ya-share2__container")) {
                return;
            }

            window.Ya.share2(element);
            element.dataset.shareInitialized = "true";
        };

        const loadShareScript = () => {
            loadYandexShareScript()
                .then(initShareWidget)
                .catch((error) => console.error("Yandex share script failed to load:", error));
        };

        if ("requestIdleCallback" in window) {
            const idleCallbackId = window.requestIdleCallback(loadShareScript);
            return () => window.cancelIdleCallback(idleCallbackId);
        }

        const timeoutId = window.setTimeout(loadShareScript, 500);
        return () => window.clearTimeout(timeoutId);
    }, []);

    return (
        <div
            ref={shareRef}
            className="ya-share2"
            data-curtain
            data-size="s"
            data-services="telegram,whatsapp"
            data-title={title}
        ></div>
    );
};

export default ShareButtons;
