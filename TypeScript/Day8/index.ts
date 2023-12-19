import fs from "fs";

const input = fs.readFileSync(__dirname + `\\${process.env.INPUTFILE}.txt`, { encoding: "utf-8" });
const lines = input.split(/\r\n|\n/);

enum Instruction {
	right = "R",
	left = "L",
}

class Node {
	public name: string = "";
	public routes: [string, string] = [] as any as [string, string];
	public constructor(name: string, routes: [string, string]) {
		this.name = name;
		this.routes = routes;
	}
}

(function main1() {
	let instructions: Instruction[] = [];
	let steps = 0;
	let nodeMap = {} as Record<string, Node>;
	for (let i = 0; i < lines.length; i++) {
		if (i === 0) {
			instructions = lines[i].split("") as Instruction[];
			continue;
		}
		if (i === 1) continue;

		const name = lines[i].split(" = ")[0];
		const routes: [string, string] = lines[i]
			.split(" = ")[1]
			.replace("(", "")
			.replace(")", "")
			.replace(",", "")
			.split(" ") as [string, string];

		// console.log("node name => ", name, "\nroutes =>", routes);

		nodeMap = {
			...nodeMap,
			[name]: new Node(name, routes),
		};
	}
	console.log(
		"nodes length",
		Object.keys(nodeMap).length,
		"instructions length",
		instructions.length
	);

	// walk the map with given instructions
	let instrQueue = [...instructions];

	let reachedDest = false;
	let currentNode = nodeMap["AAA"]; // start at AAA or you'll be stuck in infinite loop foreverrrr

	while (!reachedDest) {
		desert: for (const node of Object.values({ [currentNode.name]: currentNode })) {
			if (instrQueue.length === 0 && !reachedDest) {
				instrQueue = [...instructions];
			}
			const instr = instrQueue.shift();
			const right = node.routes[1];
			const left = node.routes[0];

			if (instr === Instruction.right) {
				steps++;
				if (right === "ZZZ") {
					reachedDest = true;
					break desert;
				} else {
					currentNode = nodeMap[right];
				}
			} else if (instr === Instruction.left) {
				steps++;
				if (left === "ZZZ") {
					reachedDest = true;
					break desert;
				} else {
					currentNode = nodeMap[left];
				}
			}
		}
	}

	console.log("part1", steps);
})();
(function main2() {
	console.log("part2", null);
})();
