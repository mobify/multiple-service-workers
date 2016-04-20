/**
 * Second event handlers for key events, so that we can verify what
 * happens as we handle events.
 */
'use strict';

let WORKER2 = 'worker2';

self.addEventListener(
    'activate',
    function(event) {
        console.log(WORKER2 + ' activate event');
        event.waitUntil(
            self.clients.claim()
        )
    }
);

self.addEventListener(
    'install',
    function(event) {
        console.log(WORKER2 + ' install event');
        event.waitUntil(
            self.skipWaiting()
        );
    }
);

self.addEventListener(
    'fetch',
    function(event) {
        console.log(
            WORKER2 + ' fetch event for ' + event.request.url
        );
        // Let the event fall through so that the resource is fetched
        // as normal.
    }
);

self.addEventListener(
    'push',
    function(event) {
        console.log(
            WORKER2 + ' push event'
        )
    }
);
