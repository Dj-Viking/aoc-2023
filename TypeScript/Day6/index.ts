import fs from "fs";
type Durations = Record<number, number>;
type Distances = Record<number, number>;

class Races {
	public durations: Durations[] = [];
	public recordDistances: Distances[] = [];
	public winningPermutations: number[][] = [];

	constructor() {}

	public findBestWinningPermutations(race: number, hold: number = 0): boolean {
		if (this.winningPermutations.length !== race + 1) {
			this.winningPermutations.push([]);
		}
		let holdTime = hold || 0; //ms
		let distanceOverTimeAfterHold = 1 * holdTime; // one mm per ms

		const recordToBeat = this.recordDistances[race][race + 1];
		const raceDuration = this.durations[race][race + 1];

		const timeLeftInRace = raceDuration - holdTime;
		const totalDistance = distanceOverTimeAfterHold * timeLeftInRace;

		if (totalDistance > recordToBeat && holdTime < raceDuration) {
			this.winningPermutations[race].push(holdTime);
			return this.findBestWinningPermutations(race, holdTime + 1);
		} else if (totalDistance <= recordToBeat && holdTime < raceDuration) {
			return this.findBestWinningPermutations(race, holdTime + 1);
		} else if (holdTime >= raceDuration) {
			return true;
		}

		return false;
	}
}

function parseLines(lines: string[], races: Races): void {
	for (const line of lines) {
		if (line.includes("Time")) {
			const nums = line
				.replace(/Time:/, "")
				.trim()
				.split(" ")
				.filter((s) => !!s)
				.map((s) => Number(s));

			nums.forEach((num, i) => {
				races.durations.push({
					[i + 1]: num,
				});
			});
		}

		if (line.includes("Distance")) {
			const nums = line
				.replace(/Distance:/, "")
				.trim()
				.split(" ")
				.filter((s) => !!s)
				.map((s) => Number(s));

			nums.forEach((num, i) =>
				races.recordDistances.push({
					[i + 1]: num,
				})
			);
		}
	}
}

if (!process.env.INPUTFILE?.includes("2")) {
	(function main1() {
		const input = fs.readFileSync(
			__dirname + `\\${process.env.INPUTFILE?.includes("sample") ? "sample" : "input"}.txt`,
			{ encoding: "utf-8" }
		);
		const lines = input.split(/\r\n|\n/);
		const races = new Races();

		parseLines(lines, races);

		let gotAllPermutations = false;
		let i = 0;
		const winningPermutations: number[][] = [];
		while (!gotAllPermutations) {
			races.findBestWinningPermutations(i);
			winningPermutations.push(races.winningPermutations[i]);
			if (winningPermutations.length === races.durations.length) {
				gotAllPermutations = true;
			} else {
				i++;
			}
		}

		let part1 = 1;
		for (const numarr of winningPermutations) {
			part1 *= numarr.length;
		}
		console.log("part1", part1);
	})();
}
(function main2() {
	const input = fs.readFileSync(
		__dirname + `\\${process.env.INPUTFILE?.includes("sample") ? "sample2" : "input2"}.txt`,
		{ encoding: "utf-8" }
	);
	const lines = input.split(/\r\n|\n/);
	const races = new Races();

	parseLines(lines, races);

	let gotAllPermutations = false;
	const winningPermutations: number[][] = [];

	let race = 0;
	let hold = 0;
	// couldn't use part1 methods because it would exceed allowed maximum call stack size in javascript!
	while (!gotAllPermutations) {
		if (winningPermutations.length !== race + 1) {
			winningPermutations.push([]);
		}
		let holdTime = hold || 0; //ms
		let distanceOverTimeAfterHold = 1 * holdTime; // one mm per ms

		const recordToBeat = races.recordDistances[race][race + 1];
		const raceDuration = races.durations[race][race + 1];

		const timeLeftInRace = raceDuration - holdTime;
		const totalDistance = distanceOverTimeAfterHold * timeLeftInRace;

		if (totalDistance > recordToBeat && holdTime < raceDuration) {
			winningPermutations[race].push(holdTime);
			hold += 1;
		} else if (totalDistance <= recordToBeat && holdTime < raceDuration) {
			hold += 1;
		} else if (holdTime >= raceDuration) {
			gotAllPermutations = true;
		}
	}

	let part2 = 1;
	for (const numarr of winningPermutations) {
		part2 *= numarr.length;
	}
	console.log("part2", part2);
})();
