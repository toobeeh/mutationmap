import {mutationEvent} from "@/content/observer.ts";
import DebuggerComponent from "@/components/debugger.component.ts";
import MutationComponent from "@/components/mutation.component.ts";

console.log("MutationMap ~ Devtools");

/*  setup connection to background -> content script*/
const tabId = chrome.devtools.inspectedWindow.tabId;
const port = chrome.runtime.connect({
    name: "devtools",
});
port.postMessage({
    type: "register",
    tabId,
});

/* define custom UI components */
customElements.define("mutationmap-debugger", DebuggerComponent);
customElements.define("mutationmap-mutation", MutationComponent);

const debuggerComponent = new DebuggerComponent();
document.body.appendChild(debuggerComponent);

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
        if(Array.isArray(result)) {
            debuggerComponent.log = result as unknown as mutationEvent[];
        }
        else if (result === undefined) {
            debuggerComponent.log = [];
        }
        else {
            console.warn("Unexpected result from getUnitLog:", result);
        }
    });
}

