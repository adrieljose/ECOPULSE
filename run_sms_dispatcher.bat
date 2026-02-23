@echo off
title EcoPulse SMS Dispatcher
echo Starting SMS Dispatcher Loop...
echo Press Ctrl+C to stop.
:loop
php c:\xampp\htdocs\ecopulse\auto_sms_alerts.php
timeout /t 10 >nul
goto loop
