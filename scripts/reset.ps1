Write-Host "`n!!! WARNING: This will delete node_modules, dist, .next, and reset the database !!!" -ForegroundColor Red
$confirm = Read-Host "Are you sure you want to proceed? (y/N)"

if ($confirm -ne "y") {
    Write-Host "Reset aborted."
    exit
}

Write-Host "Cleaning root..." -ForegroundColor Gray
Remove-Item -Path "node_modules", "package-lock.json" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Cleaning backend..." -ForegroundColor Gray
Remove-Item -Path "backend/node_modules", "backend/dist" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Cleaning frontend..." -ForegroundColor Gray
Remove-Item -Path "frontend/node_modules", "frontend/.next" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Resetting database..." -ForegroundColor Gray
docker-compose down -v --remove-orphans 2>$null
Remove-Item -Path "backend/prisma/migrations" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Cleanup complete. Run 'npm run setup' to reinstall." -ForegroundColor Green
