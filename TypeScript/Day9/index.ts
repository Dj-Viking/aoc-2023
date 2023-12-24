import fs from "fs";

const input = fs.readFileSync(__dirname + `\\${process.env.INPUTFILE}.txt`, { encoding: "utf-8" });
const lines = input.split(/\r\n|\n/);

(function main1() {

    console.log("part1", null);
})();
(function main2() {

    console.log("part2", null);
})();
