@echo off
echo Setting up environment for the dental appointment booking system...

REM Add Node.js to the PATH temporarily
set PATH=C:\Program Files\nodejs;%PATH%

REM Install dependencies if needed
if not exist node_modules (
    echo Installing dependencies...
    call npm install
) else (
    echo Dependencies already installed.
)

REM Create .env.local if it doesn't exist
if not exist .env.local (
    echo Creating .env.local file...
    copy .env.local.example .env.local
    echo Please update the .env.local file with your actual configuration values.
) else (
    echo .env.local file already exists.
)

echo Environment setup complete!
echo.
echo To start the development server, run: npm run dev
echo To build the application, run: npm run build
echo To start the production server, run: npm run start

REM Start a new command prompt with the updated PATH
cmd /k "echo Node.js environment is ready. & echo Current directory: %CD%"