TARGET = build

.PHONY: all clean codex js css

all: $(TARGET) $(TARGET)/index.html codex js css

$(TARGET):
	mkdir -p $(TARGET)

$(TARGET)/index.html:
	php index.php > $(TARGET)/index.html

codex:
	mkdir -p $(TARGET)/codex
	php codex/index.json.php > $(TARGET)/codex/index.json
	cp -r codex/*.json $(TARGET)/codex/

js:
	cp -r js $(TARGET)/

css:
	cp -r css $(TARGET)/

clean:
	rm -rf $(TARGET)
