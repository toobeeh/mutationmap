export const mutationHandlerModule = `
const index = {};

export function register(fileHash, units) {
    index[fileHash] = units;
}

export function handle(id) {
    const [file, unitIndex] = id.split("#");
    const unit = index[file]?.[unitIndex];
    if(!unit) {
        console.warn("No unit found for id:", id);
    }
    else {
        document.dispatchEvent(new CustomEvent("attributionUnitEntered", {detail: unit}));
    }
}
`;
