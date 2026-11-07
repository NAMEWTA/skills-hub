NODE ?= node

.PHONY: check build hooks

check:
	$(NODE) scripts/check.mjs --full

build: check

hooks:
	$(NODE) scripts/install-hooks.mjs
