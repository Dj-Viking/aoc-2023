param(
    [Parameter(Mandatory)]
    $day
)

$year = $(Get-Date).ToString().Split(" ")[0].Split("/")[2];

& "C:\Program Files\Google\Chrome\Application\chrome.exe" "https://adventofcode.com/$year/day/$day/input"