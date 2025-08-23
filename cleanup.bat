@echo off
echo Closing all Node.js processes...
taskkill /F /IM node.exe >nul 2>&1

echo Removing node_modules...
rmdir /s /q node_modules >nul 2>&1

echo Removing .next directory...
rmdir /s /q .next >nul 2>&1

echo Removing pnpm store...
pnpm store prune

echo Cleanup complete!
pause
