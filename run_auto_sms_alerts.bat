@echo off
cd /d C:\xampp\htdocs\ecopulse
:loop
php auto_sms_alerts.php
timeout /t 5 >nul
goto loop

