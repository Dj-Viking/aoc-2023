param(
    $DayNumber = 0,
    $inputfile = "sample"
)

$env:INPUTFILE = $inputfile;

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