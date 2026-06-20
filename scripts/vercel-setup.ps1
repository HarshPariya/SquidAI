# Sync .env.local to Vercel (run after: npx vercel login)
# Usage: .\scripts\vercel-setup.ps1 -VercelUrl "https://your-app.vercel.app"

param(
    [Parameter(Mandatory = $true)]
    [string]$VercelUrl
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$envFile = Join-Path $root ".env.local"

if (-not (Test-Path $envFile)) {
    Write-Error ".env.local not found at $envFile"
}

$base = $VercelUrl.Trim().TrimEnd("/")
if ($base -notmatch "^https?://") {
    $base = "https://$base"
}

Write-Host "Using NEXTAUTH_URL=$base" -ForegroundColor Cyan

$skip = @("NODE_ENV")
$extra = @{
    "NEXTAUTH_URL"   = $base
    "AUTH_TRUST_HOST" = "true"
}

function Set-VercelEnv {
    param([string]$Name, [string]$Value, [string[]]$Targets)
    foreach ($t in $Targets) {
        $existing = npx vercel@latest env ls $t 2>$null | Select-String "^\s+$Name\s"
        if ($existing) {
            Write-Host "  remove $Name ($t)" -ForegroundColor DarkGray
            npx vercel@latest env rm $Name $t --yes 2>$null | Out-Null
        }
        $Value | npx vercel@latest env add $Name $t 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "Failed to set $Name for $t"
        } else {
            Write-Host "  set $Name ($t)" -ForegroundColor Green
        }
    }
}

$targets = @("production", "preview", "development")

Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -eq "" -or $line.StartsWith("#")) { return }
    $eq = $line.IndexOf("=")
    if ($eq -lt 1) { return }
    $key = $line.Substring(0, $eq).Trim()
    $val = $line.Substring($eq + 1).Trim()
    if ($skip -contains $key) { return }
    if ($key -eq "NEXTAUTH_URL") { return }
    Write-Host "Env: $key"
    Set-VercelEnv -Name $key -Value $val -Targets $targets
}

foreach ($kv in $extra.GetEnumerator()) {
    Write-Host "Env: $($kv.Key)"
    Set-VercelEnv -Name $kv.Key -Value $kv.Value -Targets $targets
}

Write-Host ""
Write-Host "Done. Deploy with: npx vercel --prod" -ForegroundColor Cyan
Write-Host "Add Google redirect URI: $base/api/auth/callback/google" -ForegroundColor Yellow
