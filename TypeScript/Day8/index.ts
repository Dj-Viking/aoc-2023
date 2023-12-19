import fs from "fs";

const input = fs.readFileSync(__dirname + `\\${process.env.INPUTFILE}.txt`, { encoding: "utf-8" });
const lines = input.split(/\r\n|\n/);

class RouteMap<
	K extends string = string,
	V extends [string, string] = [string, string]
> extends Map<K, V> {
	public unsafeGet(key: K): V {
		return this.get(key)!;
	}

	public addRoute(node: K, links: V) {
		this.set(node, links);
	}
}

class DesertMap {
	routeMap: RouteMap = new RouteMap();
	instructions: string[] = [];
}

(function main1() {
	const dMap = new DesertMap();
	for (let i = 0; i < lines.length; i++) {
		if (i === 0) {
			dMap.instructions = lines[i].split("");
			continue;
		}
		if (i === 1) continue;

		const node = lines[i].split(" = ")[0];
		const links: [string, string] = lines[i]
			.split(" = ")[1]
			.replace("(", "")
			.replace(")", "")
			.replace(",", "")
			.split(" ") as [string, string];

		console.log("node => ", node, "\nlinks =>", links);

		dMap.routeMap.addRoute(node, links);

		// return;
	}
	console.log(dMap);
	console.log("part1", null);
})();
(function main2() {
	console.log("part2", null);
})();
