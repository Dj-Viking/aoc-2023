import fs from "fs";

const input = fs.readFileSync(__dirname + `\\${process.env.INPUTFILE}.txt`, { encoding: "utf-8" });
const lines = input.split(/\r\n|\n/);
// card1: winning numbers | My numbers
// 20407
// part 2 23806951

// FIND A WAY TO DO IT!!!!!
type ParseResult = {
    cardNum: number;
    winning: number[];
    mine: number[];
};
(function main1() {
    const parsed: ParseResult[] = lines.map((line) => {
        const clean = line.replace(/ +/g, " ").replace("Card ", "");
        const [cardNum, rest] = clean.split(": ");
        const [winning, mine] = rest.split(" | ");

        return {
            cardNum: Number(cardNum),
            winning: winning.split(" ").map((s) => Number(s)),
            mine: mine.split(" ").map((s) => Number(s)),
        } as ParseResult;
    });

    const matchingCounts = parsed.map((card) => {
        const matches = card.mine.filter((c) => card.winning.includes(c));
        return matches.length;
    });

    const sum = matchingCounts
        .map((count) => {
            return count === 0 ? 0 : Math.pow(2, count - 1);
        })
        .reduce((a, b) => a + b, 0);

    console.log("part1", sum);
})();
(function main2() {
    console.log("part2", null);
})();
