import http.server

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == '__main__':
    print("Starting server on 127.0.0.1:8080 with caching disabled...")
    http.server.test(HandlerClass=NoCacheHandler, port=8080, bind="127.0.0.1")
