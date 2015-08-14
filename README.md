# Online Codex 2

Hier soll der neue Online Codex entstehen.

## Entwicklerhinweise

- Bitte eigenen Branch anlegen die Änderungen werden dann von mir (Martin) in den master gemergt
- Bitte keine Projektdateien aus der IDE pushen (siehe .gitignore)/ nur Daten für die lauffähige Anwendung
- dokumentieren nicht vergessen!

## Build

Abhängigkeiten (Debianpaketnamen):
- `make`
- `php-cli`

Zum Testen kann man die webserver.sh nutzen, die auch gleich den Defaultbrowser mitstartet oder einen anderen Webserver mit php Unterstützung.

Zu verwendene Buildtargets:
- `make` bzw `make all` baut die Anwendung in `./build/`
- `make clean` löscht dieses Verzeichnis 
