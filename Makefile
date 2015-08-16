TARGET = build

.PHONY: all clean codex js css

all: $(TARGET) $(TARGET)/index.html codex js css

$(TARGET):
	mkdir -p $(TARGET)

$(TARGET)/index.html:
	php index.php > $(TARGET)/index.html

codex:
	cp -r codex $(TARGET)/

js:
	cp -r js $(TARGET)/

css:
	cp -r css $(TARGET)/

clean:
	rm -rf $(TARGET)
