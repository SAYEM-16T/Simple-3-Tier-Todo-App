#!/bin/sh
set -e
sudo dnf update -y
sudo dnf install -y docker git
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"
if command -v docker >/dev/null 2>&1; then
  docker --version
fi
echo "Install docker compose plugin if not already present by your AMI"
