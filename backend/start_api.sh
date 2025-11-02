#!/bin/bash
cd /home/leos/ac-heating-web-vision/backend
exec /home/leos/.local/bin/uvicorn main:app --host 0.0.0.0 --port 8000
