This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

### package.json


    {
      "name": "se5820",
      "version": "0.1.0",
      "private": true,
      "dependencies": {
        "bootstrap": "^4.1.3",
        "i18next": "^11.9.0",
        "ionicons": "^4.4.3",
        "konva": "^2.4.0",
        "memoize-one": "^4.0.2",
        "node-sass-chokidar": "^1.3.3",
        "open-iconic": "^1.1.1",
        "react": "^16.5.2",
        "react-dom": "^16.5.2",
        "react-i18next": "^8.0.7",
        "react-konva": "^1.7.15",
        "react-redux": "^5.0.7",
        "react-router-dom": "^4.3.1",
        "react-router-redux": "^5.0.0-alpha.9",
        "react-scripts": "2.0.4",
        "reactstrap": "^6.3.0",
        "redux": "^4.0.0",
        "source-map-explorer": "^1.6.0",
        "url-search-params": "^1.1.0",
        "whatwg-fetch": "^3.0.0"
      },
      "scripts": {
        "analyze": "source-map-explorer build/static/js/main.*",
        "start-js": "react-scripts start",
        "start": "npm-run-all -p watch-css start-js",
        "build-js": "react-scripts build",
        "build": "npm-run-all build-css build-js",
        "test": "react-scripts test --env=jsdom",
        "eject": "react-scripts eject",
        "build-css": "node-sass-chokidar --include-path ./src --include-path ./node_modules src/ -o src/ --source-map-root ./src --source-map true --source-map-embed --output-style compressed",
        "watch-css": "npm run build-css && node-sass-chokidar --include-path ./src --include-path ./node_modules src/ -o src/ --watch --recursive"
      },
      "proxy": "http://localhost:9998/se5820",
      "devDependencies": {
        "@babel/polyfill": "^7.0.0",
        "npm-run-all": "^4.1.3"
      },
      "browserslist": [
        ">0.2%",
        "not dead",
        "not ie <= 11",
        "not op_mini all"
      ]
    }


### Icon
//https://useiconic.com/open
//https://ionicons.com/

i.ion-md-move
i.ion-md-settings
i.ion-md-folder