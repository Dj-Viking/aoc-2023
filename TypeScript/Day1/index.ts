import fs from "fs";

const input = fs.readFileSync(__dirname + "\\input.txt", { encoding: "utf8" });
// const input = fs.readFileSync(__dirname + "\\sample.txt", { encoding: "utf8" });

(function main1() {
    // console.log("hello world", input);

    let sum = 0;
    for (const line of input.split("\r\n")) {
        // console.log(Number(line.replace(/[a-z]*/g, "")));
        const str: string = line.replace(/[a-z]*/g, "");
        sum += Number(`${str[0]}${str[str.length - 1]}`);
    }

    console.log(sum);
})();
(function main2() {
    // stole from reddit the author really jebaited me on day 1
    const data = input
        .split("\n")
        .map((l) => {
            const dgs = l
                .split("")
                .map((c, i) => {
                    const nxt = l.slice(i);
                    if (nxt.startsWith("one")) return 1;
                    if (nxt.startsWith("two")) return 2;
                    if (nxt.startsWith("three")) return 3;
                    if (nxt.startsWith("four")) return 4;
                    if (nxt.startsWith("five")) return 5;
                    if (nxt.startsWith("six")) return 6;
                    if (nxt.startsWith("seven")) return 7;
                    if (nxt.startsWith("eight")) return 8;
                    if (nxt.startsWith("nine")) return 9;
                    return parseInt(c);
                })
                .filter((n) => !!n);
            return Number("" + dgs[0] + dgs.at(-1)!);
        })
        .reduce((a, b) => a + b, 0);
    console.log("hello world", data);
})();
