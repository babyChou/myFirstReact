1. Go to "~\se5820\src\styles\img"
2. Run "php pic.php > ..\_img.scss"

 "build-css": "node-sass-chokidar --include-path ./src --include-path ./node_modules src/ -o src/ --source-map-root ./src --source-map true --source-map-embed",
 
    "watch-css": "npm run build-css && node-sass-chokidar --include-path ./src --include-path ./node_modules src/ -o src/  --source-map-root ./src --source-map true --source-map-embed --watch --recursive"