param(
    [Parameter(Mandatory, Position = 0)]
    $day
)

node ./_getInput.js $day;