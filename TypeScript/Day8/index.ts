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
main1();
function main2() {
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

	let reachedDest = false;

	// start at every node that ends with A
	let startingNodes = Object.values(nodeMap).filter((node) => node.name.endsWith("A"));
	let currentNodes: Node[] = [...startingNodes];
	console.log("starting nodes", startingNodes);

	// return;

	while (!reachedDest) {
		desert2: for (let j = 0; j < startingInstructions.length; j++) {
			// if after each step of all nodes at once
			// check if they are all at a node ending with Z
			if (currentNodes.every((node) => node.end)) {
				reachedDest = true;
				break desert2;
			}
			steps++;
			// if (steps % 1000000 === 0 && currentNodes.some((node) => node.end)) {
			// 	// console.log("steps", steps, "\ncurrent nodes", currentNodes);
			// }
			for (let i = 0; i < currentNodes.length; i++) {
				const instr = startingInstructions[j];
				const currentNode = currentNodes[i];
				const left = currentNode.routes[0];
				const right = currentNode.routes[1];
				if (instr === Instruction.left) {
					if (left.endsWith("Z")) {
						console.log(steps, "LEFT ENDED WITH Z", left, currentNodes);
						currentNodes[i] = nodeMap[left];
						currentNodes[i].end = true;
					} else {
						currentNodes[i] = nodeMap[left];
						currentNodes[i].end = false;
					}
				} else if (instr === Instruction.right) {
					if (right.endsWith("Z")) {
						if (steps % 5 === 0) {
							console.log(steps, "RIGHT ENDED WITH Z", right, currentNodes);
						}
						currentNodes[i] = nodeMap[right];
						currentNodes[i].end = true;
					} else {
						currentNodes[i] = nodeMap[right];
						currentNodes[i].end = false;
					}
				}
			}
		}
	}
	// 223848 TOO LOW
	// 138879 TOO LOW
	// 138882 TOO LOW
	// i think my solution was right but this is going to take too long
	console.log("part2", steps);
}

// im too much of a noob to know what LCM means or why it pertains to this problem :(
(function main2() {
	const nodes: Record<string, { L: string; R: string }> = {};

	for (let i = 1; i < lines.length; i++) {
		const line = lines[i];
		nodes[line.substring(0, 3)] = {
			L: line.substring(7, 10),
			R: line.substring(12, 15),
		};
	}

	const instructions = lines[0].split("") as Array<"R" | "L">;
	const starts = [];
	for (const key in nodes) {
		if (Object.prototype.hasOwnProperty.call(nodes, key) && key[2] === "A") {
			starts.push(key);
		}
	}

	const lengths = starts.map((start) => {
		let steps = 0;
		let curr = start;
		for (let i = 0; curr[2] !== "Z"; i = (i + 1) % instructions.length) {
			steps++;
			curr = nodes[curr][instructions[i]];
		}
		return steps;
	});

	const gcd = (a: number, b: number) => {
		while (b > 0) [a, b] = [b, a % b];
		return a;
	};
	const lcm = (a: number, b: number) => (a * b) / gcd(a, b);
	console.log(
		"part2",
		lengths.reduce((n, x) => lcm(x, n), 1)
	);
})();
