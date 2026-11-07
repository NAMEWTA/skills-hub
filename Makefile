PYTHON ?= python3

.PHONY: check build hooks

check:
	$(PYTHON) scripts/check.py --full

build: check

hooks:
	$(PYTHON) scripts/install_hooks.py
