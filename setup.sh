#/usr/bin/env bash

echo "deb http://deb.debian.org/debian buster-backports main" | tee -a /etc/apt/sources.list

curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
curl -sL https://deb.nodesource.com/setup_12.x | sudo bash -

apt update
apt install -y git/buster-backports
apt install -y nodejs
apt install -y yarn

yarn install
yarn start
