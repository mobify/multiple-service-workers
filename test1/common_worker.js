/**
 * Created by benlast on 2016-04-12.
 */
"use strict";

self.addEventListener(
    'activate',
    function(event) {
        console.log(WORKER + ' activate event');
        event.waitUntil(
            self.clients.claim()
        )
    }
);

self.addEventListener(
    'install',
    function(event) {
        console.log(WORKER + ' install event');
        event.waitUntil(
            self.skipWaiting()
        );
    }
);

self.addEventListener(
    'fetch',
    function(event) {
        console.log(
            WORKER + ' fetch event for ' + event.request.url
        )
    }
);

self.addEventListener(
    'push',
    function(event) {
        console.log(
            WORKER + 'push event'
        )
    }
);
