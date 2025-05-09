@echo off
cd frontend

:: Uninstall unneeded packages
call npm uninstall @emotion/styled framer-motion

:: Install required packages
call npm install @chakra-ui/react@3.17.0 @emotion/react@11.14.0 next-themes

:: Install additional packages that might be needed
call npm install react-icons@5.5.0

echo "Dependencies installed successfully!"
pause 