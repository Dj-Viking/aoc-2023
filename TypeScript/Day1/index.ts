import { readFileSync } from "fs";

const input = readFileSync(__dirname + "\\input.txt", { encoding: "utf-8" });
const sample = readFileSync(__dirname + "\\sample.txt", { encoding: "utf-8" });

let answer1 = null;
let answer2 = null;

(function main1() {
    console.log("hello world", sample);
})();
(function main2() {})();
