import DebuggerComponent from "./components/debugger.component.ts";
import {hello, Hi} from "./test.ts";

customElements.define("test-comp", DebuggerComponent);

console.log(new Hi(), hello());
