import fs, { stat } from "fs";

const input = fs.readFileSync(__dirname + `\\${process.env.INPUTFILE}.txt`, { encoding: "utf-8" });
const lines = input.split(/\r\n|\n/);

enum Instruction {
	right = "R",
	left = "L",
}

class Node {
	public name: string = "";
	public routes: [string, string] = [] as any as [string, string];
	public end: boolean = false;
	public constructor(name: string, routes: [string, string]) {
		this.name = name;
		this.routes = routes;
	}
}

function main1() {
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
}
// main1();
class Node2 {
	public name: string = "";
	public instructions: Instruction[] = [];
	public routes: [string, string] = [] as any as [string, string];
}
(function main2() {
	let startingInstructions: Instruction[] = [];
	let steps = 0;
	let nodeMap = {} as Record<string, Node>;
	for (let i = 0; i < lines.length; i++) {
		if (i === 0) {
			startingInstructions = lines[i].split("") as Instruction[];
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
		startingInstructions.length
	);

	// walk the map with given instructions
	let instrQueue = [...startingInstructions];

	let reachedDest = false;

	// start at every node that ends with A
	let startingNodes = Object.values(nodeMap).filter((node) => node.name.endsWith("A"));
	let currentNodes: Node[] = startingNodes;
	console.log("starting nodes", startingNodes);

	// return;

	while (!reachedDest) {
		desert2: for (let j = 0; j < startingInstructions.length; j++) {
			for (let i = 0; i < currentNodes.length; i++) {
				if (currentNodes.every((node) => node.end)) {
					reachedDest = true;
					break desert2;
				}
				steps++;

				if (currentNodes[i].end) {
					continue;
				}
				const instr = startingInstructions[j];
				const currentNode = currentNodes[i];
				const left = currentNode.routes[0];
				const right = currentNode.routes[1];
				if (instr === Instruction.left && !left.includes("XXX")) {
					if (left.endsWith("Z")) {
						currentNodes[i].end = true;
						// reachedDest = true;
						// break desert2;
					} else {
						currentNodes[i] = nodeMap[left];
					}
				} else if (instr === Instruction.right && !right.includes("XXX")) {
					if (right.endsWith("Z")) {
						currentNodes[i].end = true;
						// reachedDest = true;
						// break desert2;
					} else {
						currentNodes[i] = nodeMap[right];
					}
				}
			}
		}
	}
	// 223848 TOO LOW
	// 138879 TOO LOW
	console.log("part2", steps);
})();
