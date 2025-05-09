#!/bin/bash

cd frontend

# Uninstall unneeded packages
npm uninstall @emotion/styled framer-motion

# Install required packages
npm install @chakra-ui/react@3.17.0 @emotion/react@11.14.0 next-themes

# Install additional packages that might be needed
npm install react-icons@5.5.0

echo "Dependencies installed successfully!" 