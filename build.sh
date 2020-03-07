#!/bin/bash

rm -r dist
rm data/out/*
rm data/debug/*

npm run build && node dist/testIndex.js