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

