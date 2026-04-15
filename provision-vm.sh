#!/bin/bash
set -e
# Node 22 + npm — matches versions in the coursework write-up
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential
node -v
npm -v
