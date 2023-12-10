import fs from "fs";

const input = fs.readFileSync(__dirname + `\\${process.env.INPUTFILE}.txt`, {
	encoding: "utf-8",
});
const lines = input.split(/\r\n|\n/);

/**
 * seeds: 79 14 55 13

seed-to-soil map:
| dest_range start |  src_range start | range length
|        50                98                2
         ^                  ^         
         |                  |         
|      50 51              98 99       

                mapping:  98 => 50   | 99 => 51
                         src => dest

|         52       |         50         |       48
      52.(48).99         50.(48).98

        seed => soil
mapping: src => dest 
          0  => 0
          1  => 1
            ...
          50 => 52
          51 => 53
          52 => 54
          53 => 55
            ....
          96    98
          97    99
          98    50
          99    51

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
 */

type AlamanacMapItem = {
	destRangeStart: number;
	sourceRangeStart: number;
	rangeLength: number;
};

type GardenMap = AlamanacMapItem[];

type ParsedInput = {
	seeds: number[];
	maps: GardenMap[];
};

function getNumbers(line: string): number[] {
	return line
		.trim()
		.split(" ")
		.map((s) => Number(s));
}

function parseInput(input: string): ParsedInput {
	const inputlines = input.split(/\r\n|\n/);
	const [seedsLine, ...rest] = inputlines;

	const seeds: number[] = getNumbers(seedsLine.split(":")[1]);
	const maps: GardenMap[] = [];

	for (const line of rest) {
		if (line.trim() === "") {
			continue;
		}

		if (line.includes("map")) {
			maps.push([]);
			continue;
		}

		const currentMap = maps[maps.length - 1];
		const [destRangeStart, sourceRangeStart, rangeLength] = getNumbers(line);

		currentMap.push({
			destRangeStart,
			sourceRangeStart,
			rangeLength,
		});
	}

	return { seeds, maps };
}

function getDestByMap(source: number, map: GardenMap): number {
	const mapEntry = map.find(({ sourceRangeStart, rangeLength }) => {
		return source >= sourceRangeStart && source <= sourceRangeStart + rangeLength;
	});

	if (!mapEntry) {
		return source;
	}

	const offset = source - mapEntry.sourceRangeStart;
	const dest = mapEntry.destRangeStart + offset;
	return dest;
}

function getLocationBySeed(seed: number, maps: GardenMap[]) {
	return maps.reduce((dest, map) => getDestByMap(dest, map), seed);
}

(function main1() {
	const { seeds, maps } = parseInput(input);
	const locations = seeds.map((seed) => getLocationBySeed(seed, maps));
	console.log("part1", Math.min(...locations));
})();
(function main2() {
	// console.log("part2", null);
})();
