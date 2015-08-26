TARGET = build

.PHONY: all
all: checkCodexJson $(TARGET) $(TARGET)/index.html codex js css

$(TARGET):
	mkdir -p $(TARGET)

$(TARGET)/index.html:
	php index.php make > $(TARGET)/index.html

.PHONY: codex
codex:
	mkdir -p $(TARGET)/codex
	php codex/index.json.php > $(TARGET)/codex/index.json
	cp -r codex/*.json $(TARGET)/codex/

.PHONY: js
js:
	cp -r js $(TARGET)/

.PHONY: css
css:
	cp -r css $(TARGET)/

.PHONY: clean
clean:
	rm -rf $(TARGET)

.PHONY: checkCodexJson
checkCodexJson:
	 php helper.php checkCodexJson