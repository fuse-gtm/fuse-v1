#!/usr/bin/env bash
# Install fuse-caddy-ask as a systemd service on EC2.
# Usage: sudo bash install-caddy-ask-service.sh [path-to-ask-server.py]
set -euo pipefail

SCRIPT_PATH="${1:-/opt/fuse/scripts/fuse-caddy-ask-server.py}"
SERVICE_NAME="fuse-caddy-ask"
PORT="${TLS_ASK_PORT:-9080}"
BASE_DOMAIN="${TLS_ALLOW_BASE_DOMAIN:-fusegtm.com}"

# copy script into place
mkdir -p "$(dirname "$SCRIPT_PATH")"
if [ -f "$(dirname "$0")/fuse-caddy-ask-server.py" ]; then
  cp "$(dirname "$0")/fuse-caddy-ask-server.py" "$SCRIPT_PATH"
fi
chmod +x "$SCRIPT_PATH"

cat > "/etc/systemd/system/${SERVICE_NAME}.service" <<EOF
[Unit]
Description=Fuse Caddy TLS Ask Authorization Server
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/python3 ${SCRIPT_PATH}
Restart=always
RestartSec=3

Environment=TLS_ALLOW_BASE_DOMAIN=${BASE_DOMAIN}
Environment=TLS_ALLOW_STATIC_HOSTS=app.${BASE_DOMAIN}
Environment=TLS_ALLOW_BLOCKED_SUBDOMAINS=www,mail,api,admin,smtp,ftp,ns1,ns2
Environment=TLS_ALLOW_SUBDOMAIN_REGEX=^[a-z0-9][a-z0-9-]{1,30}$
Environment=TLS_ASK_PORT=${PORT}

# security: no network exposure, minimal privileges
ProtectSystem=strict
ProtectHome=yes
NoNewPrivileges=yes

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable "${SERVICE_NAME}"
systemctl restart "${SERVICE_NAME}"

echo "Installed and started ${SERVICE_NAME} on 127.0.0.1:${PORT}"
echo "Update Caddy on_demand_tls ask to: http://127.0.0.1:${PORT}/allow"
