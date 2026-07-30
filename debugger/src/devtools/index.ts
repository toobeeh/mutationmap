/* create new sidebar in DOM explorer*/
chrome.devtools.panels.elements.createSidebarPane('Mutation Attribution', (a) => {
    a.setPage('/src/devtools/sidebar.html');
});
