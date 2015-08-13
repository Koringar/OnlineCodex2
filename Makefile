TARGET = build

.PHONY: all clean codex

all: $(TARGET) $(TARGET)/index.html $(TARGET)/codex

$(TARGET):
	mkdir -p $(TARGET)

$(TARGET)/index.html:
	php index.php > $(TARGET)/index.html

$(TARGET)/codex:
	cp -r codex $(TARGET)/

clean:
	rm -rf $(TARGET)
