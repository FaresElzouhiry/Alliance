# Local preview server: powershell -ExecutionPolicy Bypass -File serve.ps1 [-Port 8080] [-Folder site|original]
param([int]$Port = 8080, [string]$Folder = 'site')

$root = Join-Path $PSScriptRoot $Folder
$mime = @{
  '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css'; '.js' = 'application/javascript'
  '.json' = 'application/json'; '.png' = 'image/png'; '.jpg' = 'image/jpeg'; '.jpeg' = 'image/jpeg'
  '.gif' = 'image/gif'; '.webp' = 'image/webp'; '.svg' = 'image/svg+xml'; '.mp4' = 'video/mp4'
  '.woff2' = 'font/woff2'; '.woff' = 'font/woff'; '.ttf' = 'font/ttf'; '.ico' = 'image/x-icon'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving $root at http://localhost:$Port/"

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $res = $ctx.Response
  try {
    $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
    $path = [IO.Path]::GetFullPath((Join-Path $root $rel))
    if (Test-Path $path -PathType Container) {
      # like a real static host: /about-us -> /about-us/ so relative links resolve
      if (-not $ctx.Request.Url.AbsolutePath.EndsWith('/')) {
        $res.Redirect($ctx.Request.Url.AbsolutePath + '/')
        continue
      }
      $path = Join-Path $path 'index.html'
    }
    if (-not (Test-Path $path -PathType Leaf)) { $res.StatusCode = 404; $path = Join-Path $root '404.html' }
    if ($path.StartsWith($root) -and (Test-Path $path -PathType Leaf)) {
      $bytes = [IO.File]::ReadAllBytes($path)
      $type = $mime[[IO.Path]::GetExtension($path).ToLower()]
      $res.ContentType = if ($type) { $type } else { 'application/octet-stream' }
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    }
  } catch {
    $res.StatusCode = 500
  } finally {
    $res.Close()
  }
}
