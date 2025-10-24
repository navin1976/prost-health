#!/bin/bash

# Prost Health Dev Server Management Script

PROJECT_DIR="/Users/navinramachandran/Development/prost-health"
PID_FILE="$PROJECT_DIR/dev-server.pid"
LOG_FILE="$PROJECT_DIR/dev-server.log"

case "$1" in
  start)
    if [ -f "$PID_FILE" ]; then
      PID=$(cat "$PID_FILE")
      if ps -p $PID > /dev/null 2>&1; then
        echo "Dev server already running (PID: $PID)"
        echo "Visit: http://localhost:4321"
        exit 0
      else
        rm "$PID_FILE"
      fi
    fi
    
    cd "$PROJECT_DIR"
    echo "Starting dev server..."
    nohup pnpm dev > "$LOG_FILE" 2>&1 & 
    echo $! > "$PID_FILE"
    sleep 3
    
    if ps -p $(cat "$PID_FILE") > /dev/null 2>&1; then
      echo "✓ Dev server started successfully!"
      echo "  PID: $(cat $PID_FILE)"
      echo "  URL: http://localhost:4321"
      echo "  Logs: $LOG_FILE"
    else
      echo "✗ Failed to start dev server"
      cat "$LOG_FILE"
      exit 1
    fi
    ;;
    
  stop)
    if [ ! -f "$PID_FILE" ]; then
      echo "No dev server running (no PID file found)"
      exit 0
    fi
    
    PID=$(cat "$PID_FILE")
    if ps -p $PID > /dev/null 2>&1; then
      echo "Stopping dev server (PID: $PID)..."
      kill $PID
      sleep 2
      
      if ps -p $PID > /dev/null 2>&1; then
        echo "Force killing..."
        kill -9 $PID
      fi
      
      rm "$PID_FILE"
      echo "✓ Dev server stopped"
    else
      echo "Dev server not running (stale PID file)"
      rm "$PID_FILE"
    fi
    ;;
    
  restart)
    $0 stop
    sleep 2
    $0 start
    ;;
    
  status)
    if [ ! -f "$PID_FILE" ]; then
      echo "Status: Not running"
      exit 0
    fi
    
    PID=$(cat "$PID_FILE")
    if ps -p $PID > /dev/null 2>&1; then
      echo "Status: Running"
      echo "  PID: $PID"
      echo "  URL: http://localhost:4321"
      echo "  Logs: $LOG_FILE"
      echo ""
      echo "Recent logs:"
      tail -10 "$LOG_FILE"
    else
      echo "Status: Not running (stale PID file)"
      rm "$PID_FILE"
    fi
    ;;
    
  logs)
    if [ -f "$LOG_FILE" ]; then
      tail -f "$LOG_FILE"
    else
      echo "No log file found"
      exit 1
    fi
    ;;
    
  *)
    echo "Prost Health Dev Server Management"
    echo ""
    echo "Usage: $0 {start|stop|restart|status|logs}"
    echo ""
    echo "Commands:"
    echo "  start    - Start the dev server in background"
    echo "  stop     - Stop the dev server"
    echo "  restart  - Restart the dev server"
    echo "  status   - Check if server is running"
    echo "  logs     - Follow the server logs"
    echo ""
    exit 1
    ;;
esac
