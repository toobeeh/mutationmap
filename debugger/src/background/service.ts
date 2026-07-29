
/* toggle debugger ui on icon click */
chrome.action.onClicked.addListener(async () => {
    const { enabled = false } = await chrome.storage.local.get("enabled");
    const newState = !enabled;

    await chrome.action.setBadgeText({
        text: newState ? "🔎" : ""
    });

    await chrome.storage.local.set({
        enabled: newState
    });
});
