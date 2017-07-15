const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');


function wait(duration = 1e3) {
    return new Promise(resolve => setTimeout(resolve, duration));
}


chromeLauncher.launch({
    logLevel: 'silent',
    chromeFlags: [
        '--disable-gpu',
        '--headless'
    ]
}).then(async chrome => {
    const protocol = await CDP({ port: chrome.port });
    const { Page, DOM } = protocol;

    await Page.enable();
    await DOM.enable();

    Page.navigate({ url: 'http://localhost:8080/number.html' })

    await new Promise((resolve, reject) => {
        setTimeout(reject, 30e3);

        Page.loadEventFired(async () => {

            const { root: { nodeId } } = await DOM.getDocument();

            let bannerNodeId = {};
            while (!bannerNodeId.nodeId) {
                await wait();

                bannerNodeId = await DOM.querySelector({ nodeId, selector: '#qunit-banner' });
            }
            const banner = await DOM.resolveNode(bannerNodeId);
            const { attributes } = await DOM.getAttributes(bannerNodeId);


            if (attributes.includes('qunit-pass')) {
                resolve();
            } else {
                reject();
            }
        });
    })
    .then(() => {
        console.log('success');
    })
    .catch(() => {
        console.log('failed');
        process.exit(1);
    })
    .then(() => {
        protocol.close();
        chrome.kill();
    });

}).catch(ex => {
    console.error(ex);
    process.exit(1);
});
