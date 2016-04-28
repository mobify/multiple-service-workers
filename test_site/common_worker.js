/**
 * Created by benlast on 2016-04-12.
 */
'use strict';

self.addEventListener(
    'activate',
    function(event) {
        console.log(
            WORKER + ' activate event - scope is ' +
            self.registration.scope
        );
        event.waitUntil(
            self.clients.claim()
        )
    }
);

self.addEventListener(
    'install',
    function(event) {
        console.log(
            WORKER + ' install event - scope is ' +
            self.registration.scope
        );
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
        } else if (event.request.url.endsWith('/check.json')) {
            console.log('Handling check request');
            var subscription, permission;

            var promises = [
                registration.pushManager.getSubscription().then(
                    function(sub) { subscription = sub; }
                ),
                registration.pushManager.permissionState({userVisibleOnly: true}).then(
                    function(perm) { permission = perm; }
                )
            ];

            event.respondWith(
                Promise.all(promises).then(
                    function() {
                        return new Response(
                            new Blob(
                                [JSON.stringify(
                                    {
                                        subscription: !!subscription,
                                        permission: permission
                                    }
                                )],
                                {type: 'application/json'}
                            ),
                            {
                                status: 200,
                                statusText: 'OK'
                            }
                        );
                    }
                )
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
