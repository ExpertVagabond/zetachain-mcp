#!/bin/bash

# ZetaChain MCP CLI Starter (Simple)
# Port: 7001

set -e

SERVER_NAME="zetachain-mcp-cli"
PORT=7001
LOGDIR="$HOME/.claude/logs"
PIDDIR="$HOME/.claude/pids"

mkdir -p "$LOGDIR" "$PIDDIR"

LOGFILE="$LOGDIR/${SERVER_NAME}.log"
PIDFILE="$PIDDIR/${SERVER_NAME}.pid"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() { echo -e "${GREEN}[INFO]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARN]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check if already running
if [ -f "$PIDFILE" ]; then
    PID=$(cat "$PIDFILE")
    if kill -0 "$PID" 2>/dev/null; then
        print_warning "$SERVER_NAME is already running (PID: $PID)"
        exit 0
    else
        rm -f "$PIDFILE"
    fi
fi

# Kill any process using the port
if lsof -ti :$PORT >/dev/null 2>&1; then
    print_warning "Port $PORT is in use, killing existing process"
    lsof -ti :$PORT | xargs kill -9 2>/dev/null || true
    sleep 2
fi

print_status "Starting $SERVER_NAME on port $PORT..."

# Start server
nohup node server.js > "$LOGFILE" 2>&1 &
echo $! > "$PIDFILE"

sleep 3

# Verify server started
if lsof -ti :$PORT >/dev/null 2>&1; then
    print_status "$SERVER_NAME started successfully!"
    print_status "PID: $(cat $PIDFILE)"
    print_status "Port: $PORT"
    print_status "Logs: $LOGFILE"
    print_status "Health: http://localhost:$PORT/health"
else
    print_error "$SERVER_NAME failed to start"
    exit 1
fi