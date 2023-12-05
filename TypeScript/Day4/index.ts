import fs from "fs";

const input = fs.readFileSync(__dirname + `\\${process.env.INPUTFILE}.txt`, { encoding: "utf-8" });
const lines = input.split(/\r\n|\n/);
// card1: winning numbers | My numbers
// 20407
// part 2 23806951

type ParseResult = {
    cardNumStr: string;
    winning: number[];
    mine: number[];
};
(function main1() {
    const parsed: ParseResult[] = lines.map((line) => {
        const clean = line.replace(/ +/g, " ").replace("Card ", "");
        const [cardNumStr, rest] = clean.split(": ");
        const [winning, mine] = rest.split(" | ");

        return {
            cardNumStr,
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

// win more scratch cards equal to the number of winning numbers you have
(function main2() {
    const parsed: ParseResult[] = lines.map((line) => {
        const clean = line.replace(/ +/g, " ").replace("Card ", "");
        const [cardNumStr, rest] = clean.split(": ");
        const [winning, mine] = rest.split(" | ");

        return {
            cardNumStr,
            winning: winning.split(" ").map((s) => Number(s)),
            mine: mine.split(" ").map((s) => Number(s)),
        } as ParseResult;
    });

    // console.log("scratch start", scratchCards);

    const matchingCounts = parsed.map((card) => {
        const matches = card.mine.filter((c) => card.winning.includes(c));
        return matches.length;
    });

    const cards = Array.from(lines, () => 1);

    for (let i = 0; i < matchingCounts.length; i++) {
        const winCount = matchingCounts[i];
        for (let j = 1; j <= winCount; j++) {
            cards[i + j] += cards[i];
        }
    }

    // console.log("scratch end", cards);

    console.log(
        "part2",
        cards.reduce((a, b) => a + b, 0)
    );
})();
