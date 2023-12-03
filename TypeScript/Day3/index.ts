// TODO: look at this again and make a solution that i can understand
import fs from "fs";
import path from "path";

const input = fs.readFileSync(path.join(__dirname, `\\${process.env.INPUTFILE}.txt`), { encoding: "utf-8" });
// const _lines = input.split(/\r\n|\n/);
const lines = input.split(/\r\n|\n/);

const SAMPLE_SIZE = 10;
const INPUT_SIZE = 140;

const SIZE_TO_USE = process.env.INPUTFILE === "sample" ? SAMPLE_SIZE : INPUT_SIZE;

function isNumber(char: string): boolean {
    return !isNaN(Number(char));
}

function isSymbol(char: string): boolean {
    return /[^0-9\.]/.test(char);
}

function isStar(char: string): boolean {
    return /\*/.test(char);
}

function isDot(char: string): boolean {
    return char === ".";
}

type Direction = "up" | "down" | "right" | "left" | "ruDiag" | "luDiag" | "rdDiag" | "ldDiag";
const directions: Record<Direction, readonly [number, number]> = {
    // [col, row]
    up: [-1, 0],
    down: [1, 0],
    left: [0, -1],
    right: [0, 1],
    rdDiag: [1, 1], // [down, right]
    ruDiag: [-1, 1], // [up,   right]
    ldDiag: [1, -1], // [down, left]
    luDiag: [-1, -1], // [up,   left]
};
type NeighborsResult = Record<Direction, { char: string; coords: [number, number] }>;

function isInBounds(col: number, row: number, graph: string[][]): boolean {
    return 0 <= col && col <= graph.length - 1 && 0 <= row && row <= graph.length - 1;
}

function getNeighbors(numinfo: readonly [string, number, number], graph: string[][]): NeighborsResult[] {
    let result: NeighborsResult = {} as any;
    const results: NeighborsResult[] = [];

    console.log("infasdfasdfo", numinfo);

    for (const dir of Object.keys(directions)) {
        const [dcol, drow] = directions[dir];
        const [char_col, char_row] = [numinfo[1], numinfo[2]];
        const is_inbounds = isInBounds(char_col + dcol, char_row + drow, graph);
        if (is_inbounds) {
            result = {} as any;
            result[dir] = {
                char: graph[char_col + dcol][char_row + drow],
                coords: [char_col + dcol, char_row + drow],
            };
            results.push(result);
            console.log("SOME SHIT IS IN BOUNDS FUCKING DO SOMETHING", result);
            // return results;
        }
    }

    return results;
}

// check neighbors of the entire number like a box
/**
 * ..xxxxx......x3
 * ..x123x......xx
 * ..xxxxx.xxxxx..
 * ........x436x..
 * ..xxxx..xxxxx..
 * ..x12x.........
 * ..xxxx....xxx..
 * ..........x3x..
 * ..........xxx..
 */
// will have to look at this later and make a solution that i understand
// (function main1() {
//     let sum = 0;
//     const problem_graph = new Array(SIZE_TO_USE).fill(null).map(() => new Array(SIZE_TO_USE).map(() => "."));

//     for (let i = 0; i < lines.length; i++) {
//         for (let j = 0; j < lines[i].length; j++) {
//             problem_graph[i][j] = lines[i][j];
//         }
//     }

//     let numacc = "";
//     let numinfo: [string, number, number][] = [];
//     for (let colc = 0; colc < problem_graph.length; colc++) {
//         const row = problem_graph[colc];
//         for (let rowc = 0; rowc < row.length; rowc++) {
//             const current_char = row[rowc];
//             if (isNumber(current_char)) {
//                 numacc += current_char;
//                 numinfo.push([current_char, colc, rowc]);
//             } else if (!isNumber(current_char)) {
//                 console.log("NOT A NUMBER CHECK SOME BULLSHIT", current_char, numacc);
//                 if (isSymbol(current_char)) {
//                     console.log(
//                         "IS SYMBOL RIGHT NEXT TO NUMBER IMMEDIATELY ADD THAT SHIT",
//                         "\n",
//                         current_char,
//                         "\n",
//                         numacc
//                     );
//                     const num = Number(numacc);
//                     sum += num;
//                     console.log("sum now", sum);
//                     numacc = "";
//                     numinfo = [];
//                 } else if (isDot(current_char)) {
//                     console.log("current char is DOT CHECK NEIGHBORS OF accumulated number", numacc);
//                     let checked = false;
//                     if (numacc === "") continue;

//                     // check neighbors
//                     let nbrs = [] as NeighborsResult[];
//                     checkinfo: for (const info of numinfo) {
//                         console.log("info", info);
//                         nbrs = getNeighbors(info, problem_graph);
//                         console.log("nbrs", nbrs);
//                         foundsym: for (const result of nbrs) {
//                             for (const [_, value] of Object.entries(result)) {
//                                 const [res_col, res_row] = value.coords;
//                                 const issym = isSymbol(problem_graph[res_col][res_row]);
//                                 if (issym) {
//                                     console.log("found a fucking symbol ", problem_graph[res_col][res_row]);

//                                     sum += Number(numacc);
//                                     console.log("sum now", sum);

//                                     numacc = "";
//                                     numinfo = [];
//                                     break checkinfo;
//                                     // return;
//                                 }
//                             }
//                         }
//                     }
//                     // return;
//                     numacc = "";
//                     numinfo = [];
//                 }
//             }
//         }
//     }

//     console.log("part1", sum);
// })();

const part1 = () => {
    let partNumberSum = 0;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const thisLine = lines[lineIndex];
        const matches = [...thisLine.matchAll(/(\d+)/g)];

        const previousLine = lines[lineIndex - 1] || "";
        const nextLine = lines[lineIndex + 1] || "";

        for (const match of matches) {
            const textBlock = [
                previousLine.substring(match.index! - 1, match.index! + match[0].length + 1),
                lines[lineIndex].substring(match.index! - 1, match.index! + match[0].length + 1),
                nextLine.substring(match.index! - 1, match.index! + match[0].length + 1),
            ];

            const findSymbol = textBlock.join("").match(/[^\d.]/);
            if (findSymbol) partNumberSum += Number(match[0]);
        }
    }

    return partNumberSum;
};

interface IPartNumber {
    value: number;
    start: number;
    end: number;
}

const isPartAdjacent = (part: IPartNumber, index: number) => {
    return part.start - 1 <= index && index <= part.end + 1;
};

const part2 = () => {
    let gearRatios = 0;

    const partNumbersByLine = lines.map((line) => {
        const matches = line.matchAll(/(\d+)/g);
        const partNumbers: Array<IPartNumber> = [];

        for (const match of matches) {
            partNumbers.push({
                value: Number(match[0]),
                start: match.index!,
                end: match.index! + match[0].length - 1,
            });
        }

        return partNumbers;
    });

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const thisLine = lines[lineIndex];
        const matches = [...thisLine.matchAll(/\*/g)];

        for (const match of matches) {
            let parts = [
                ...partNumbersByLine[lineIndex],
                ...partNumbersByLine[lineIndex - 1],
                ...partNumbersByLine[lineIndex + 1],
            ];

            parts = parts.filter((part) => isPartAdjacent(part, match.index!));

            if (parts.length === 2) {
                gearRatios += parts[0].value * parts[1].value;
            }
        }
    }

    return gearRatios;
};

console.log(part1());
console.log(part2());
