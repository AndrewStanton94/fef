#!/bin/bash

rm -r dist
if command -v npm &> /dev/null
then
	npm run build && node dist/index.js
else
	/usr/local/bin/npm run build &&\
	/usr/local/bin/node dist/index.js
fi