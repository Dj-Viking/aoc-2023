param(
    [Parameter(Mandatory, Position = 0)]
    [int16]$DayNumber = 0,

    [Parameter(Position = 1)]
    [string]$InputFile = ""
)

$file = 
$(
    switch ($InputFile) {
        "" {
            "input"
        }
        "s" {
            "sample"
        }
        Default {
            "$InputFile"
        }
    }
)

$env:INPUTFILE = $file;

if (-not (Test-Path ".\dist")) {
    node ./node_modules/typescript/bin/tsc -b .
    
    Copy-Item -Path "./Day$DayNumber/$file.txt" -Destination "./dist/Day$DayNumber"
    Copy-Item -Path "./Day$DayNumber/$file.txt" -Destination "./dist/Day$DayNumber"
    node "./dist/Day$DayNumber/index.js"
}
else {
    Copy-Item -Path "./Day$DayNumber/$file.txt" -Destination "./dist/Day$DayNumber"
    Copy-Item -Path "./Day$DayNumber/$file.txt" -Destination "./dist/Day$DayNumber"
    node "./dist/Day$DayNumber/index.js"
}

$env:INPUTFILE = $null;