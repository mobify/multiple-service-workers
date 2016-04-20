/**
 * Created by benlast on 2016-04-12.
 */
'use strict';

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

let MOBIFY_PNG_RE = /(.*)\/mobify\d.png/;

self.addEventListener(
    'fetch',
    function(event) {
        console.log(
            WORKER + ' fetch event for ' + event.request.url
        );
        let match = MOBIFY_PNG_RE.exec(event.request.url);
        if (match) {
            console.log(WORKER + ' intercepted fetch');
            event.respondWith(
                fetch(match[1] + '/mobify.png')
            );
        }
        // Let the event fall through so that the resource is fetched
        // as normal.
    }
);

self.addEventListener(
    'push',
    function(event) {
        console.log(
            WORKER + ' push event'
        )
    }
);
