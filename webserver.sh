#! /bin/bash
make clean && make
/usr/bin/x-www-browser localhost:8080/index.html >/dev/null 2>&1 &
cd build
php -S localhost:8080
