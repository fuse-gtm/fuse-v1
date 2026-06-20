#!/usr/bin/env python3
"""Caddy on-demand TLS authorization endpoint.

Validates whether Caddy should issue a certificate for a given domain.
Binds to 127.0.0.1 only — not exposed to the internet.

Environment variables:
  TLS_ALLOW_BASE_DOMAIN        Base domain suffix (default: fusegtm.com)
  TLS_ALLOW_STATIC_HOSTS       Comma-separated always-allowed FQDNs
                                (default: app.fusegtm.com)
  TLS_ALLOW_BLOCKED_SUBDOMAINS Comma-separated reserved/blocked labels
                                (default: www,mail,api,admin,smtp,ftp,ns1,ns2)
  TLS_ALLOW_SUBDOMAIN_REGEX    Regex for valid workspace labels
                                (default: ^[a-z0-9][a-z0-9-]{1,30}$)
  TLS_ASK_PORT                 Listen port (default: 9080)
"""

import http.server
import os
import re
import sys
from urllib.parse import urlparse, parse_qs

BASE_DOMAIN = os.environ.get("TLS_ALLOW_BASE_DOMAIN", "fusegtm.com")
STATIC_HOSTS = set(
    h.strip()
    for h in os.environ.get("TLS_ALLOW_STATIC_HOSTS", f"app.{BASE_DOMAIN}").split(",")
    if h.strip()
)
BLOCKED_SUBDOMAINS = set(
    s.strip()
    for s in os.environ.get(
        "TLS_ALLOW_BLOCKED_SUBDOMAINS", "www,mail,api,admin,smtp,ftp,ns1,ns2"
    ).split(",")
    if s.strip()
)
SUBDOMAIN_RE = re.compile(
    os.environ.get("TLS_ALLOW_SUBDOMAIN_REGEX", r"^[a-z0-9][a-z0-9-]{1,30}$")
)
PORT = int(os.environ.get("TLS_ASK_PORT", "9080"))


def is_allowed(domain: str) -> bool:
    domain = domain.strip().lower().rstrip(".")

    # static allowlist
    if domain in STATIC_HOSTS:
        return True

    # must be a subdomain of the base domain
    suffix = f".{BASE_DOMAIN}"
    if not domain.endswith(suffix):
        return False

    # extract the subdomain label (single level only)
    label = domain[: -len(suffix)]
    if "." in label:
        return False

    # block reserved subdomains
    if label in BLOCKED_SUBDOMAINS:
        return False

    # validate label format
    if not SUBDOMAIN_RE.match(label):
        return False

    return True


class AskHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        params = parse_qs(parsed.query)
        domain = params.get("domain", [None])[0]

        if not domain:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b"missing domain param")
            return

        if is_allowed(domain):
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"allowed")
        else:
            self.send_response(403)
            self.end_headers()
            self.wfile.write(b"denied")

    def log_message(self, format, *args):
        sys.stderr.write(
            f"{self.log_date_time_string()} ask domain={args[0] if args else '?'} "
            f"result={args[1] if len(args) > 1 else '?'}\n"
        )


def main():
    server = http.server.HTTPServer(("127.0.0.1", PORT), AskHandler)
    print(f"fuse-caddy-ask listening on 127.0.0.1:{PORT}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    server.server_close()


if __name__ == "__main__":
    main()
