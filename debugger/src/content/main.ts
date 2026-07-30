import '@webcomponents/custom-elements';
import {Observer} from "./observer.ts";

console.log("MutationMap ~ Content");

/* listen for mutations and associate with emitted attribution units */
const observer = new Observer();
observer.observe();

/* basic debugger */
document.addEventListener("contextmenu", (e) => {
    const target = e?.composedPath()?.[0];
    if(target instanceof Node) console.log(observer.getHistoryForNode(target));

    console.log("Full history:", observer.getHistory());
});

/* expose to be used by eval in devtools sidebar */
(document as any).getUnitLog = function(node: Node) {
    return observer.getHistoryForNode(node);
}
