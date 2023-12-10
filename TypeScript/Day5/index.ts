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

type RecordKey = number | string | symbol;

class AlamanacMap<K extends RecordKey = RecordKey, V extends number = number> {
	public storage = new Object() as Record<K, V>;
	constructor() {}
}

let seedToSoilMap = new AlamanacMap();
let soilToFertilizerMap = new AlamanacMap();
let fertilizerToWaterMap = new AlamanacMap();
let waterToLightMap = new AlamanacMap();
let lightToTemperatureMap = new AlamanacMap();
let humidityToLocationMap = new AlamanacMap();

// sample
let seedsToPlant: number[] = [];

function getSeedsToPlant(_line: string): number[] {
	let line = _line.replace(/seeds: /g, "");

	return line.split(" ").map((s) => Number(s));
}

function getSrcDestRangeFromLine(_line: string[]): [number, number, number] {
	const numsline = _line.map((s) => Number(s));

	return [numsline[1], numsline[0], numsline[2]];
}

function makeSeedsToSoilMap<T extends AlamanacMap<number, number>>(
	_line: string
): T {
	let map = new AlamanacMap<number, number>();

	const numsections = _line
		.replace(/seed-to-soil map:/, "")
		.split(/^\d|\n/)
		.filter((s) => !!s); // ["num num num", "num num num"]

	for (const sec of numsections) {
		const [seed, fert, rangeLength] = getSrcDestRangeFromLine(
			sec.split(" ")
		);
		console.log("going to map some stuff", seed, fert, rangeLength);

		for (let i = 0; i <= rangeLength; i++) {
			switch (true) {
				case seedsToPlant.includes(seed + i) &&
					!map.storage.hasOwnProperty(seed + i):
					{
						map.storage[seed + i] = fert + i;
						console.log(
							"\x1b[32m",
							"mapped from almanac and in seeds list",
							seed + i,
							" => ",
							fert + i
						);
					}
					break;
				case seedsToPlant.includes(i) && !map.storage.hasOwnProperty(i):
					{
						map.storage[i] = i;
						console.log(
							"\x1b[36m",
							"mapped by default and in seeds list",
							i,
							" => ",
							map.storage[i]
						);
					}
					break;

				default:
					continue;
			}
		}
	}

	console.log("map now", map);

	return map as T;
}

(function main1() {
	seedsToPlant = getSeedsToPlant(lines[0]);

	const sections = lines.join("\n").split(/\r\n\r\n|\n\n/);

	seedToSoilMap = makeSeedsToSoilMap(
		sections.find((sec) => /seed-to-soil/g.test(sec))!
	);

	// soilToFertilizerMap = makeSoilToFertilizerMap(
	// 	sections.find((sec) => /soil-to-fertilizer/g.test(sec))!
	// );

	// console.log("part1", null);
})();
(function main2() {
	// console.log("part2", null);
})();
