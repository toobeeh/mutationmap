import Port = chrome.runtime.Port;

console.log("MutationMap ~ Background");

const devtoolsPorts = new Map<number, Port>();

/* forward messages from content script to debugger */
chrome.runtime.onConnect.addListener((port) => {

    /* handle devtools connections */
    if (port.name === "devtools") {
        let tabId: number | null = null;

        port.onMessage.addListener((msg) => {
            tabId = msg.tabId;

            /* devtools have been opened */
            if (msg.type === "register" && tabId !== null) {
                devtoolsPorts.set(tabId, port);
            }
        });

        port.onDisconnect.addListener(() => {
            if (tabId !== null) {
                devtoolsPorts.delete(tabId);
            }
        });

        return;
    }

    /* handle contentscript updates */
    if (port.name === "content") {

        port.onMessage.addListener((msg) => {

            const tabId = port.sender?.tab?.id;
            const devtoolsPort = devtoolsPorts.get(tabId ?? -1);

            if (devtoolsPort) {
                devtoolsPort.postMessage(msg);
            }
        });
    }
});
