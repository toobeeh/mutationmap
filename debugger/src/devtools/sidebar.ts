console.log("Sidebar script running...");

/*  setup connection to background -> content script*/
const tabId = chrome.devtools.inspectedWindow.tabId;
const port = chrome.runtime.connect({
    name: "devtools",
});
port.postMessage({
    type: "register",
    tabId,
});

/* set sidebar to currently selected element */
updateSidebar();

/*  update sidebar when selected element changes*/
chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
    updateSidebar();
});

/* listen for update requests when mutations happen */
port.onMessage.addListener((message) => {
    if(message.type === "mutation") {
        updateSidebar();
    }
});

/**
 * Update the sidebar with the current unit log for the selected element.
 */
function updateSidebar() {

    /* need to use eval to pass node reference */
    chrome.devtools.inspectedWindow.eval("document.getUnitLog($0)", {
        useContentScriptContext: true
    }, (result) => {
        const res = JSON.stringify(result);
        document.body.innerHTML = res;
    });
}

