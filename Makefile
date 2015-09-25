TARGET := build

TOCOPY := css/onlinecode2.css js/onlinecodex2.js \
	js/libs/jquery/jquery.js js/libs/jquery-mobile/jquery.mobile.js \
	js/libs/jquery-mobile/jquery.mobile.css
TOCOMPILE := codex/index.json js/oc2.h.js
INDEX := index
CODEX := $(wildcard codex/*.json)
DIRS := $(TARGET) $(TARGET)/codex $(TARGET)/js $(TARGET)/js/libs \
	$(TARGET)/js/libs/jquery $(TARGET)/js/libs/jquery-mobile \
	$(TARGET)/js/libs/jquery-mobile/images $(TARGET)/css

#erzeugt die Ziele
TOCOPYTARGET := $(addprefix $(TARGET)/, $(TOCOPY))
TOCOMPILETARGET := $(addprefix $(TARGET)/, $(TOCOMPILE))
INDEXTARGET := $(addsuffix .html, $(addprefix $(TARGET)/, $(INDEX)))
CODEXTARGET := $(addprefix $(TARGET)/, $(CODEX))

ifeq ($(OS), Windows_NT)
  RM := rmdir
  CP := xcopy
  PHP := php.exe
else
  RM := rm -rf
  CP := cp
  PHP := php
endif

.PHONY: all
all: $(TOCOMPILETARGET) $(TOCOPYTARGET) $(INDEXTARGET) $(CODEXTARGET)

$(INDEXTARGET): $(addsuffix .php,$(INDEX)) | $(TARGET)
	$(PHP) $< > $@

$(TOCOMPILETARGET): | $(TARGET)
	for i in $(TOCOMPILE); do \
	  $(PHP) $$i.php > $(addprefix $(TARGET)/, $$i) ; \
	done

$(CODEXTARGET): | $(TARGET)
	for i in $(CODEX); do \
	  $(PHP) helper.php minJson $$i $(addprefix $(TARGET)/, $$i) ;\
	done

$(TOCOPYTARGET): | $(TARGET)
	for i in $(TOCOPY); do \
	  $(PHP) helper.php minJsCss $$i $(addprefix $(TARGET)/, $$i) ; \
	done

$(TARGET):
	for i in $(DIRS); do \
	  mkdir $$i ; \
	done
	
.PHONY: clean
clean:
	$(RM) $(TARGET)

.PHONY: checkCodexJson
checkCodexJson:
	$(PHP) helper.php checkCodexJson