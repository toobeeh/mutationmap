import '@webcomponents/custom-elements';
import {Observer} from "./observer.ts";

console.log("MutationMap ~ Content");

/* listen for mutations and associate with emitted attribution units */
const observer = new Observer();
observer.observe();

/* expose to be used by eval in devtools sidebar */
(document as any).getUnitLog = observer.getHistoryForNode.bind(observer);
(document as any).getDescendantUnitLog = observer.getHistoryForNodeDescendants.bind(observer);
