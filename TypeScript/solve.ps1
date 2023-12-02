param(
    [Parameter(Mandatory, Position = 0)]
    [int16]$DayNumber = 0,

    [Parameter(Mandatory, Position = 1)]
    [string]$InputFile = "sample"
)

$env:INPUTFILE = $InputFile;

if (-not (Test-Path ".\dist")) {
    node ./node_modules/typescript/bin/tsc -b .
    
    Copy-Item -Path "./Day$DayNumber/input.txt" -Destination "./dist/Day$DayNumber"
    Copy-Item -Path "./Day$DayNumber/sample.txt" -Destination "./dist/Day$DayNumber"
    node "./dist/Day$DayNumber/index.js"
}
else {
    Copy-Item -Path "./Day$DayNumber/input.txt" -Destination "./dist/Day$DayNumber"
    Copy-Item -Path "./Day$DayNumber/sample.txt" -Destination "./dist/Day$DayNumber"
    node "./dist/Day$DayNumber/index.js"
}

$env:INPUTFILE = $null;