# Web UI Compile Enviroment setup

## Install necessary 

  $ curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -
  $ sudo apt-get install nodejs
  $ cd ./user/www/
  $ npm install

## Compile Web code 

  $ cd ./user/www/
  $ npm run build
  $ cp "/user/www/build/*" files to working "/www/"
