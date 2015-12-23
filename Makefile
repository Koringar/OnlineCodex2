
include build.mf

TOCOPY := css/onlinecode2.css js/onlinecodex2.js \
	js/libs/jquery/jquery.js js/libs/jquery-mobile/jquery.mobile.js \
	js/libs/jquery-mobile/jquery.mobile.css
TOCOMPILE := codex/index.json
INDEX := index
CODEX := $(wildcard codex/*.json)
LANG := $(wildcard language/*.json)
DIRS := $(TARGET)/codex $(TARGET)/js $(TARGET)/js/libs \
	$(TARGET)/js/libs/jquery $(TARGET)/js/libs/jquery-mobile \
	$(TARGET)/js/libs/jquery-mobile/images $(TARGET)/css \
	$(TARGET)/language

#erzeugt die Ziele
TOCOPYTARGET := $(addprefix $(TARGET)/, $(TOCOPY))
TOCOMPILETARGET := $(addprefix $(TARGET)/, $(TOCOMPILE))
INDEXTARGET := $(addsuffix .html, $(addprefix $(TARGET)/, $(INDEX)))
CODEXTARGET := $(addprefix $(TARGET)/, $(CODEX))
LANGTARGET := $(addprefix $(TARGET)/, $(LANG))
CACHEMANIFEST := $(addprefix $(TARGET)/, cache.manifest)

# Wird beim clean entfernt
TOCLEAN := $(TOCOPYTARGET) $(TOCOMPILETARGET) $(INDEXTARGET) $(CODEXTARGET) \
	$(LANGTARGET) $(CACHEMANIFEST) $(DIRS)

# Programme
RM := rm -rf
CP := cp
PHP := php

.PHONY: all
all: $(TOCOMPILETARGET) $(TOCOPYTARGET) \
	$(INDEXTARGET) $(CODEXTARGET) \
	$(CACHEMANIFEST) $(LANGTARGET)

$(INDEXTARGET): $(addsuffix .php,$(INDEX)) | $(DIRS)
	$(PHP) $< > $@

$(TOCOMPILETARGET): | $(DIRS)
	for i in $(TOCOMPILE); do \
	  $(PHP) $$i.php > $(addprefix $(TARGET)/, $$i) ; \
	done

$(CODEXTARGET): | $(DIRS)
	for i in $(CODEX); do \
	  $(PHP) helper.php minJson $$i $(addprefix $(TARGET)/, $$i) ;\
	done
	
$(LANGTARGET): | $(DIRS)
	for i in $(LANG); do \
	  $(PHP) helper.php minJson $$i $(addprefix $(TARGET)/, $$i) ;\
	done

$(TOCOPYTARGET): | $(DIRS)
	for i in $(TOCOPY); do \
	  $(PHP) helper.php minJsCss $$i $(addprefix $(TARGET)/, $$i) ; \
	done

$(CACHEMANIFEST): | $(DIRS)
	$(PHP) helper.php genCacheManifest $(CACHEMANIFEST) $(INDEXTARGET:$(TARGET)/%=%) $(TOCOMPILETARGET:$(TARGET)/%=%) $(TOCOPYTARGET:$(TARGET)/%=%)

$(DIRS): | $(TARGET)
	for i in $(DIRS); do \
	  mkdir $$i ; \
	done
	
$(TARGET):
	mkdir $(TARGET)
	
.PHONY: clean
clean:
	$(RM) $(TOCLEAN)

.PHONY: checkCodexJson
checkCodexJson:
	$(PHP) helper.php checkCodexJson

.PHONY: installDependency
installDepencys:
	composer require justinrainbow/json-schema:~1.3

build.mf: 
	echo 'TARGET := build' > build.mf

