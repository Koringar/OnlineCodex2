#! /bin/bash
/usr/bin/x-www-browser localhost:8080/index.php >/dev/null 2>&1 &
php -S localhost:8080
