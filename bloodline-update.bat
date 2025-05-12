@echo off
cd C:\Users\Administrator\Documents\blood-donation

:: Optional: log output
echo --- [%date% %time%] Pulling latest changes --- >> update.log

git reset --hard HEAD >> update.log 2>&1
git pull origin main >> update.log 2>&1

:: Restart NSSM-managed service
nssm stop BloodLine
nssm start BloodLine >> update.log 2>&1

:: Optional: log success
echo --- [%date% %time%] Update complete --- >> update.log
