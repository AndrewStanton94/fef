#!/bin/bash

rm -r dist
rm data/out/*
rm data/debug/*

npm run build && nodejs dist/index.js