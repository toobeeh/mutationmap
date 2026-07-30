import {mutationEvent} from "@/content/observer.ts";
import DebuggerComponent from "@/components/debugger.component.ts";
import MutationComponent from "@/components/mutation.component.ts";
import SettingsComponent from "@/components/settings.component.ts";
import TitleComponent from "@/components/title.component.ts";

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
customElements.define("mutationmap-title", TitleComponent);
customElements.define("mutationmap-debugger", DebuggerComponent);
customElements.define("mutationmap-mutation", MutationComponent);
customElements.define("mutationmap-settings", SettingsComponent);

const debuggerComponent = document.querySelector<DebuggerComponent>("mutationmap-debugger")!;
const settingsComponent = document.querySelector<SettingsComponent>("mutationmap-settings")!;

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

/* listen to settings changes */
settingsComponent.addEventListener("change", updateSidebar);

/**
 * Update the sidebar with the current unit log for the selected element.
 */
function updateSidebar() {

    const viewDescendants = settingsComponent.viewDescendants;
    /*const onlyLatest = settingsComponent.onlyLatest;*/

    const expression = viewDescendants ?
        `document.getDescendantUnitLog($0)`:
        `document.getUnitLog($0)`;

    /* need to use eval to pass node reference */
    chrome.devtools.inspectedWindow.eval(expression, {
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

