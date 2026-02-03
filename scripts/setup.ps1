param (
    [string]$Mode = "PROMPT"
)

Write-Host "`n--- Blendwit CMS Setup ---" -ForegroundColor Blue

if ($Mode -eq "PROMPT") {
    $choice = Read-Host "Select Setup Mode: [1] Manual (Local DB), [2] Docker (Containerized DB)"
} else {
    $choice = $Mode
}

# 1. Root dependencies
Write-Host "`n[1/5] Installing root dependencies..." -ForegroundColor Gray
npm install

# 2. Environment Setup
Write-Host "[2/5] Setting up environment files..." -ForegroundColor Gray
if (-not (Test-Path "backend/.env")) {
    if (Test-Path "backend/.env.example") {
        Copy-Item "backend/.env.example" "backend/.env"
        Write-Host "Created backend/.env from example." -ForegroundColor Green
    } else {
        Write-Host "DATABASE_URL=`"postgresql://admin:password123@localhost:5432/blendwit_cms?schema=public`"`nJWT_SECRET=`"supersercretkey123`"`nPORT=3001" | Out-File -FilePath "backend/.env" -Encoding utf8
        Write-Host "Generated default backend/.env." -ForegroundColor Yellow
    }
}

# 3. Database Infrastructure
if ($choice -eq "2") {
    Write-Host "[3/5] Starting Docker containers..." -ForegroundColor Gray
    docker-compose up -d
    Write-Host "Waiting for database to be ready..."
    Start-Sleep -s 10
} else {
    Write-Host "[3/5] Skipping Docker. (Manual setup selected)" -ForegroundColor Gray
}

# 4. Database Initialization
Write-Host "[4/5] Initializing database..." -ForegroundColor Gray
cd backend
npx prisma generate
npx prisma migrate dev --name init
npm run seed
cd ..

# 5. Build
Write-Host "[5/5] Finalizing setup..." -ForegroundColor Gray
npm run build

Write-Host "`nSetup Complete! Run 'npm run dev' to start the application." -ForegroundColor Green
Write-Host "Super Admin: superadmin@blendwit.com / admin123" -ForegroundColor Cyan
