#!/bin/sh
rm -rf /coderun/*
mkdir -p /coderun

chown compiler:code /coderun
chmod 711 /coderun

exec node server.js