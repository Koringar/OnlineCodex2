#! /bin/bash

php index.php > index.html
echo "CACHE MANIFEST" > cache.manifest
echo "#Version "`date` >> cache.manifest
echo "index.html" >> cache.manifest
