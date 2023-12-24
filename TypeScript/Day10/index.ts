import fs from "fs";

const input = fs.readFileSync(__dirname + `\\${process.env.INPUTFILE}.txt`, { encoding: "utf-8" });
const lines = input.split(/\r\n|\n/);
let steps = 0;

const elbowTiles = ["L", "J", "F", "7"] as const;
const vertHorzTiles = ["|", "-"] as const;
const ground = "." as const;

const visited = new Set<ReturnType<Point["toString"]>>();

type TileName = (typeof elbowTiles)[number] | (typeof vertHorzTiles)[number] | typeof ground;

class Point {
	public y = 0;
	public x = 0;
	public constructor(y: number, x: number) {
		this.y = y;
		this.x = x;
	}

	public toString() {
		return `${this.y},${this.x}`;
	}
}

type Direction = "up" | "down" | "left" | "right";

const Vectors: Record<Direction, Point> = {
	up: new Point(-1, 0),
	down: new Point(1, 0),
	left: new Point(0, -1),
	right: new Point(0, 1),
};
// excluding . because we'll never arrive to this kind of tile.
const TileToAllowedDirections: Record<Exclude<TileName, ".">, Record<Direction, boolean>> = {
	"-": {
		down: false,
		left: true,
		right: true,
		up: false,
	},
	"7": {
		down: true,
		left: true,
		right: false,
		up: false,
	},
	J: {
		down: false,
		left: true,
		right: false,
		up: true,
	},
	F: {
		down: true,
		left: false,
		right: true,
		up: false,
	},
	L: {
		down: false,
		left: false,
		right: true,
		up: true,
	},
	"|": {
		down: true,
		left: false,
		right: false,
		up: true,
	},
};

type TilePointRecord = { tile: Exclude<TileName, ".">; point: Point };

type ExcludedGround = Exclude<TileName, ".">;

class PointOptions {
	public neighbors: Record<Direction, TilePointRecord> = {} as any;
	public hasOptions: boolean = false;

	public constructor(pt: Point, grid: string[][], tile: ExcludedGround) {
		for (const [direction, vec] of Object.entries(Vectors)) {
			const nextTile = grid?.[pt.y + vec.y]?.[pt.x + vec.x];
			if (nextTile) {
				// where are we allowed to go based on what tile we are?
				// assign neighbors by where we are allowed to go
				if (TileToAllowedDirections[tile][direction]) {
					if (!visited.has(new Point(pt.y + vec.y, pt.x + vec.x).toString())) {
						this.neighbors[direction] = {} as any;

						this.neighbors[direction].tile = grid[pt.y + vec.y][
							pt.x + vec.x
						] as ExcludedGround;

						this.neighbors[direction].point = new Point(pt.y + vec.y, pt.x + vec.x);
						this.hasOptions = true;
					}
				}
			}
		}
	}
}
// furthest from starting point
function walkGrid(grid: string[][], startCoords: [number, number]) {
	const [startCol, startRow] = startCoords;
	const startPoint = new Point(startCol, startRow);
	visited.add(startPoint.toString());
	// move first step based on where we are currently
	// F
	let nextCol = startCol;
	let nextRow = startRow + 1;
	let currentPoint = new Point(nextCol, nextRow);

	visited.add(currentPoint.toString());

	steps++;
	// keep going while the current location doesn't match the start
	let walking = true;
	while (walking) {
		// what tile are we currently on??
		const currentTile = grid[currentPoint.y][currentPoint.x] as Exclude<TileName, ".">;
		// what are our options based on neighbors
		const currentOptions = new PointOptions(currentPoint, grid, currentTile);
		if (!currentOptions.hasOptions) {
			walking = false;
		}
		// console.log(
		// 	"current tile",
		// 	currentTile,
		// 	"\ncurrentoptions",
		// 	currentOptions,
		// 	"\nvisted",
		// 	visited
		// );
		moveNext: for (const [direction, nextTilePointRecord] of Object.entries(
			currentOptions.neighbors
		)) {
			if (TileToAllowedDirections[currentTile][direction]) {
				if (nextTilePointRecord.point.toString() === startPoint.toString()) {
					walking = false;
					break moveNext;
				}
				if (!visited.has(nextTilePointRecord.point.toString())) {
					// set current point here....
					currentPoint = new Point(
						nextTilePointRecord.point.y,
						nextTilePointRecord.point.x
					);
					visited.add(nextTilePointRecord.point.toString());
				}
			}
		}
	}
}
(function main1() {
	// create the grid
	const grid: string[][] = [];
	let startCoords: [number, number] = [0, 0];

	for (let col = 0; col < lines.length; col++) {
		grid.push([]);
		for (let row = 0; row < lines[0].length; row++) {
			grid[col][row] = lines[col][row];
			// manually infer S here... fuck it...
			if (grid[col][row] === "S") {
				grid[col][row] = "F";
				startCoords = [col, row];
			}
		}
	}

	// infer what the S tile should be based on it's neighbors
	// inferStartTile(grid);

	walkGrid(grid, startCoords);

	// console.log("grid", grid);

	console.log("part1", visited.size / 2);
})();
(function main2() {
	console.log("part2", null);
})();
