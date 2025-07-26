# Setup environment for the dental appointment booking system

Write-Host "Setting up environment for the dental appointment booking system..." -ForegroundColor Green

# Add Node.js to the PATH temporarily
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH

# Verify Node.js is accessible
try {
    $nodeVersion = & node -v
    Write-Host "Node.js detected: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Node.js not found at C:\Program Files\nodejs. Please check your installation." -ForegroundColor Red
    Write-Host "You can download Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Install dependencies if needed
if (-not (Test-Path -Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    & npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error installing dependencies. Please check the error messages above." -ForegroundColor Red
        exit 1
    }
    Write-Host "Dependencies installed successfully." -ForegroundColor Green
} else {
    Write-Host "Dependencies already installed." -ForegroundColor Green
}

# Create .env.local if it doesn't exist
if (-not (Test-Path -Path ".env.local")) {
    Write-Host "Creating .env.local file..." -ForegroundColor Yellow
    Copy-Item -Path ".env.local.example" -Destination ".env.local"
    Write-Host "Please update the .env.local file with your actual configuration values." -ForegroundColor Yellow
} else {
    Write-Host ".env.local file already exists." -ForegroundColor Green
}

Write-Host "\nEnvironment setup complete!" -ForegroundColor Green
Write-Host "\nTo start the development server, run: npm run dev" -ForegroundColor Cyan
Write-Host "To build the application, run: npm run build" -ForegroundColor Cyan
Write-Host "To start the production server, run: npm run start" -ForegroundColor Cyan

Write-Host "\nStarting a new PowerShell session with the updated PATH..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Node.js environment is ready.' -ForegroundColor Green; Write-Host 'Current directory: $(Get-Location)' -ForegroundColor Cyan; `$env:PATH = 'C:\Program Files\nodejs;' + `$env:PATH"