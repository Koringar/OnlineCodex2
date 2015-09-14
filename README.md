# Online Codex 2

Hier soll der neue Online Codex entstehen.

## Entwicklerhinweise

- dokumentieren nicht vergessen!

## Test

Zum Testen kann das Projekt in einem Webserver mit aktiven PHP gelegt werden.

Den letzten Stand kann man [hier](http://martin1991zab.github.io/OnlineCodex2/) finden.

## Build

Über Makefile (@Martin1991zab):
    Abhängigkeiten (Debianpaketnamen):
    - `make`
    - `php-cli`
    
    Zu verwendene Buildtargets:
    - `make` bzw `make all` baut die Anwendung in `./build/`
    - `make clean` löscht dieses Verzeichnis

Über Ant (@Koringar):
    Abhängigkeiten:
    - `ant`
    - `php-cli`
    
    Properties (build.properties):
    - Hier müsst ihr eure spezifischen Sachen rein machen
    - `builddir`: Ordner in dem ihr das Build erstellen wollt (default build)
    - `phpCommand`: Kommando mit der euer System PHP aufrufen kann (default php)

    Zu verwendene Buildtargets:
    - `completeBuild` baut die Anwendung in `builddir`
    - `clean` löscht dieses Verzeichnis