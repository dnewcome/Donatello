#!/bin/bash
cat donatello.js rect.js circle.js ellipse.js arc.js line.js | uglifyjs > build/donatello-min.js
