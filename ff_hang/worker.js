/**
 * Demonstrate FF hang when registration.pushManager.getSubscription()
 * is called in the activate event handler.
 */
'use strict';

self.addEventListener(
    'activate',
    function(event) {
        console.log('activate event');

        var promises = [self.clients.claim()];

        promises.push(
            self.registration.pushManager.getSubscription()
            .then(
                function(sub) {
                    console.log('Subscription is ' + JSON.stringify(sub));
                }
            )
            .catch(
                function(error) {
                    console.log('Error getting subscription ' + error);
                }
            )
        );

        event.waitUntil(
            Promise.all(promises)
        )
    }
);

self.addEventListener(
    'install',
    function(event) {
        console.log('install event');
        event.waitUntil(
            self.skipWaiting()
        );
    }
);

