#!/usr/bin/env python
import argparse
import httplib
import json
import logging
import os
import requests
import SimpleHTTPServer
import SocketServer
import sys
import urlparse

logging.basicConfig()
LOGGER = logging.getLogger()

PORT = 8080

GCM_API_KEY = os.getenv('GCM_API_KEY')


def push(endpoint):
    """
    Send a non-payload push to the given endpoint (works with
    GCM).
    :param endpoint: the subscription's endpoint
    :return: True for success, False for failure
    """

    if not GCM_API_KEY:
        LOGGER.error(
            'GCM_API_KEY is not defined'
        )
        return False

    parsed = urlparse.urlparse(endpoint)
    path_elements = parsed.path.split('/')
    subscription_id = path_elements.pop()
    gcm_endpoint = urlparse.urlunparse(
        (
            parsed.scheme,
            parsed.netloc,
            '/'.join(path_elements),
            '', '', ''
        )
    )


    push_headers = {
        'Authorization': 'key=%s' % GCM_API_KEY,
        'Content-Type': 'application/json'
    }

    push_data = {
        'registration_ids': [subscription_id],
        'time_to_live': 3600
    }

    response = requests.post(
        gcm_endpoint,
        headers=push_headers,
        data=json.dumps(push_data)
    )

    if response.status_code != httplib.OK:
        LOGGER.error(
            'Received status %s %s from push POST',
            response.status_code,
            response.reason
        )
        return False

    return True


class Server(SimpleHTTPServer.SimpleHTTPRequestHandler):

    def do_GET(self):
        if self.path.endswith('/'):
            self.path += 'index.html'
        return SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        """
        The only POST we handle is to send a push.
        """
        if not self.path.endswith('/push'):
            self.send_error(httplib.NOT_FOUND)
            return
        try:
            data = json.loads(
                self.rfile.read(
                    int(
                        self.headers['Content-Length']
                    )
                )
            )

        except Exception as ex:
            LOGGER.exception(
                'Exception in POST',
                exc_info=ex
            )
            self.send_error(httplib.INTERNAL_SERVER_ERROR)
            return

        if isinstance(data, dict):
            endpoint = data.get('endpoint')
            if endpoint is not None:
                if push(endpoint):
                    self.send_response(
                        httplib.OK,
                        message='Push sent'
                    )
                else:
                    self.send_error(httplib.INTERNAL_SERVER_ERROR)

                return

        self.send_error(httplib.BAD_REQUEST)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument(
        'source',
        default='test_site',
        help='directory containing root of site',
        nargs='?'
    )

    args = parser.parse_args()
    if not os.path.isdir(args.source):
        sys.stderr.write(
            'Source \'%s\' must be a directory\n' % args.source
        )
        sys.exit(1)

    os.chdir(os.path.abspath(args.source))

    # Listen on all addresses
    server = SocketServer.TCPServer(
        ('', PORT),
        Server
    )

    print 'Listening on %s:%d' % server.server_address
    try:
        server.serve_forever()
    finally:
        server.shutdown()


