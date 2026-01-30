$binDir = Join-Path $env:USERPROFILE 'bin'
if (-not (Test-Path $binDir)) {
  New-Item -ItemType Directory -Path $binDir | Out-Null
}

$nodePath = (Get-Command node).Source
$cliPath = Resolve-Path (Join-Path $PSScriptRoot '..\node_modules\typescript-language-server\lib\cli.mjs')

$code = @"
using System;
using System.Diagnostics;
class Program {
  static int Main(string[] args) {
    var psi = new ProcessStartInfo();
    psi.FileName = @"$nodePath";
    psi.Arguments = "\"" + @"$cliPath" + "\" " + string.Join(" ", args);
    psi.UseShellExecute = false;
    psi.RedirectStandardInput = false;
    psi.RedirectStandardOutput = false;
    psi.RedirectStandardError = false;
    var proc = Process.Start(psi);
    proc.WaitForExit();
    return proc.ExitCode;
  }
}
"@

Add-Type -TypeDefinition $code -OutputAssembly (Join-Path $binDir 'typescript-language-server.exe') -ErrorAction Stop
Write-Output "Created $binDir\typescript-language-server.exe"
