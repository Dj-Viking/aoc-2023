import fs from "fs";

const input = fs.readFileSync(__dirname + `\\${process.env.INPUTFILE}.txt`, { encoding: "utf8" });

(function main1() {
    let gamespossible = 0;
    const ids: number[] = [];

    for (const line of input.split("\r\n")) {
        // for (const line of sample.split("\r\n")) {
        // console.log(line);

        let gameobj: Record<string, number> = {};
        const gameId = Number(
            line
                .split(":")[0]
                .replace(/Game\s/, "")
                .trim()
        );
        // console.log("ROUND===========================gameid", gameId, "game obj", gameobj);
        gameobj["red"] = 0;
        gameobj["green"] = 0;
        gameobj["blue"] = 0;
        const newline = line.replace(/Game \d{1,3}:\s/, "");
        const subsets = newline.split(";").map((str) => str.trim());
        // console.log("subsets", subsets);

        let redgood = true;
        let bluegood = true;
        let greengood = true;
        subset: for (const subset of subsets) {
            // console.log("subset", subset);
            for (const dice of subset.split(",").map((s) => s.trim())) {
                // console.log("dice", dice);
                if (dice.includes("red")) {
                    const num = Number(dice.split(" ")[0]);
                    // console.log("num", num);
                    if (num > 12) {
                        redgood = false;
                        break subset;
                    }
                }
                if (dice.includes("green")) {
                    const num = Number(dice.split(" ")[0]);
                    // console.log("num", num);
                    if (num > 13) {
                        greengood = false;
                        break subset;
                    }
                }
                if (dice.includes("blue")) {
                    const num = Number(dice.split(" ")[0]);
                    // console.log("num", num);
                    if (num > 14) {
                        bluegood = false;
                        break subset;
                    }
                }
            }
        }

        if (redgood && bluegood && greengood) {
            ids.push(gameId);
        }
    }
    // console.log("ids", ids);

    console.log(
        "part1",
        ids.reduce((a, b) => a + b, 0)
    );
})();
(function main2() {
    let sum = 0;
    for (const line of input.split("\r\n")) {
        // for (const line of sample.split("\r\n")) {
        const newline = line.replace(/Game \d{1,3}:\s/, "");

        // console.log("newline", newline);
        // we kind of assume we always pick some amount of red green or blue cubes in each subset of the games

        const reds = (newline.match(/\d{1,2} red/g) ?? []).map((s) => Number(s.split(" ")[0].trim()));
        const greens = (newline.match(/\d{1,2} green/g) ?? []).map((s) => Number(s.split(" ")[0].trim()));
        const blues = (newline.match(/\d{1,2} blue/g) ?? []).map((s) => Number(s.split(" ")[0].trim()));
        // console.log(reds, greens, blues);

        const red = Math.max(...reds);
        const green = Math.max(...greens);
        const blue = Math.max(...blues);

        sum += red * green * blue;
        // console.log("sum", sum);
    }
    // for (const line of input.split("\r\n")){
    console.log("part2", sum);
})();
