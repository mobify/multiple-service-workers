# Multiple service worker tests

Install `http-server` with `npm install`.

To run the server:

```bash
./node_modules/.bin/http-server -c-1 test_site/
```

There are two pages. `http://localhost:8080/` is the root, and 
`http://localhost:8080/subpath/` is a second page. Both pages allow you
to register and unregister a service worker, and test out fetches and
push messages.

Right now you have to send a push manually, and that's non-trivial.

