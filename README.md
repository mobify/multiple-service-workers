# Multiple service worker tests

You can run a simple Node server if you're not testing push:

```bash
npm install
./node_modules/.bin/http-server -c-1 test_site/
```

...or to test Push, get your GCM API key, and run the Python server:

```bash
virtualenv venv
. venv/bin/activate
env GCM_API_KEY=<your api key> ./server.py
```

There are two pages. `http://localhost:8080/` is the root, and 
`http://localhost:8080/subpath/` is a second page. Both pages allow you
to register and unregister a service worker, and test fetches and
push messages.

# To test the iframe communication

1. Configure a proxy (e.g. Charles) to map `https://test.com` and `http://test-insecure.com`
both to `http://localhost:8080`. Start the server.
2. In Chrome or Firefox, load `https://test.com`. Make sure the JavaScript console
is visible, and click _register_ to register the service worker. Verify that
it is handling fetch events by clicking _fetch_.
3. Now load `http://test-insecure.com`. Click _iframe_ to open an iframe
to `https://test.com`. Click _fetch_ in the iframe, and verify that
the `test.com` service worker is intercepting fetches. Click _check_ to
verify that the service worker can check the permission and subscription.
