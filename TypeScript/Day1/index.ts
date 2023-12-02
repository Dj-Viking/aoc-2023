import fs from "fs";
import { converttonum, reverseStr } from "./utils";

const input = fs.readFileSync(__dirname + "\\input.txt", { encoding: "utf8" });
const sample2 = fs.readFileSync(__dirname + "\\sample.txt", { encoding: "utf8" });
const sample1 = fs.readFileSync(__dirname + "\\sample1.txt", { encoding: "utf8" });

(function main1() {
    // console.log("hello world", input);

    let sum = 0;
    // for (const line of sample1.split("\r\n")) {
    for (const line of input.split("\r\n")) {
        // console.log(Number(line.replace(/[a-z]*/g, "")));
        const str: string = line.replace(/[a-z]*/g, "");
        const finalstr = `${str[0]}${str[str.length - 1]}`;
        // console.log("final str", finalstr);

        sum += Number(finalstr);
    }

    console.log("part1", sum);
})();

(function main2() {
    let sum = 0;
    // console.log(input);
    for (const line of input.split("\r\n")) {
        // for (const line of sample2.split("\r\n")) {
        // console.log(line);

        // front
        const fmatch = line.match(/one|two|three|four|five|six|seven|eight|nine|[0-9]/);
        // console.log("line", line, fmatch);
        // console.log("fmatch", fmatch);
        // back
        const bmatch = reverseStr(line).match(/enin|thgie|neves|xis|evif|ruof|eerht|owt|eno|[0-9]/);
        // console.log("BMATCH", bmatch);

        sum += Number(`${converttonum(fmatch![0])}${converttonum(bmatch![0])}`);
    }
    console.log("part 2", sum);
})();
