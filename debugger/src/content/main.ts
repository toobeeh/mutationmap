import '@webcomponents/custom-elements';
import {Observer} from "./observer.ts";
import DebuggerComponent from "./components/debugger.component.ts";

console.log("Mutationmap debugger");

/* register custom elements */
customElements.define("mutationmap-debugger", DebuggerComponent);

/* listen for mutations and associate with emitted attribution units */
const observer = new Observer();
observer.observe();

/* listen for activated state */
chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if (!changes.enabled) return;

    const enabled = (changes.enabled.newValue ?? false) as boolean;
    console.log("Debugger enabled state changed:", enabled);
});

/* basic debugger */
document.addEventListener("contextmenu", (e) => {
    const target = e?.composedPath()?.[0];
    if(target instanceof Node) console.log(observer.getHistoryForNode(target));

    console.log("Full history:", observer.getHistory());
});
