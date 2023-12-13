import fs from "fs";

const input = fs.readFileSync(__dirname + `\\${process.env.INPUTFILE}.txt`, { encoding: "utf-8" });
const lines = input.split(/\r\n|\n/);

type CardName = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "T" | "J" | "Q" | "K" | "A";

type FacetoStrengthRecord = Record<CardName, number>;

const FaceToStrength: FacetoStrengthRecord = {
	"2": 0,
	"3": 1,
	"4": 2,
	"5": 3,
	"6": 4,
	"7": 5,
	"8": 6,
	"9": 7,
	T: 8,
	J: 9,
	Q: 10,
	K: 11,
	A: 12,
} as const;

const FaceToStrength2: FacetoStrengthRecord = {
	J: -1,
	"2": 0,
	"3": 1,
	"4": 2,
	"5": 3,
	"6": 4,
	"7": 5,
	"8": 6,
	"9": 7,
	T: 8,
	Q: 9,
	K: 10,
	A: 11,
} as const;

type HandType =
	| "FiveOfAKind"
	| "FourOfAKind"
	| "FullHouse"
	| "ThreeOfAKind"
	| "TwoPair"
	| "OnePair"
	| "HighCard";

type HandTypeToStrengthRecord = Record<HandType, number>;

const HandTypeToStrength: HandTypeToStrengthRecord = {
	HighCard: 0,
	OnePair: 1,
	TwoPair: 2,
	ThreeOfAKind: 3,
	FullHouse: 4,
	FourOfAKind: 5,
	FiveOfAKind: 6,
} as const;

type Card = Partial<FacetoStrengthRecord>;

class Hand {
	public cards: Card[] = [];
	public handType: HandType = null as any as HandType;
	public rank = 0;
	public masked = false;
	public maskedType: HandType = null as any as HandType;
	public mask = "";
	public bid = 0;
	public id = "";
	public isPart2 = false;

	public constructor(cards: string[], bid: number, part2?: boolean) {
		this.isPart2 = part2 || false;
		this.id = cards.join("");
		this.bid = bid;
		this.initHand(cards);
		if (this.isPart2) {
			this.handType = this.setHandType2();
		} else {
			this.setHandType();
		}
	}

	// check what the hand was when it initially had some jokers and then
	// see what the joker(s) should become to increase the hand's strength
	// but the strength of the J is still lower than what it is masked as
	// JKKK4 and QQQQ3 are both 4 of a kind but JKKK4 is lower strength because
	// even though J masked as K - the fourofakind itself is lower strength than the QQQQ3
	//
	// after all that - mark the card as masked
	public setHandType2(): HandType {
		const map = this.getFaceMap(this.getFaces());
		const keys = Object.keys(map);
		const keysLength = keys.length;
		const counts = Object.values(map);
		const jockersCount = !this.isPart2 ? 0 : map["J"] ?? 0;

		function assertJocker(counts: number[]) {
			if (jockersCount && !counts.includes(jockersCount)) {
				throw `Unhandled jocker, ${JSON.stringify(map, null, 2)}`;
			}
		}

		if (keysLength === 1) {
			assertJocker([5]);
			return "FiveOfAKind";
		}

		if (keysLength === 2) {
			assertJocker([1, 2, 3, 4]);
			if (jockersCount) {
				return "FiveOfAKind";
			}
			if (counts.includes(4)) {
				return "FourOfAKind";
			}
			return "FullHouse";
		}

		if (counts.includes(3)) {
			assertJocker([1, 3]);
			if (jockersCount) {
				return "FourOfAKind";
			}
			return "ThreeOfAKind";
		}

		if (counts.includes(2)) {
			assertJocker([1, 2]);

			const numOfPairs = counts.reduce(
				(numOfPairs, count) => (count === 2 ? numOfPairs + 1 : numOfPairs),
				0
			);

			if (numOfPairs > 1) {
				if (jockersCount === 1) {
					return "FullHouse";
				}
				if (jockersCount === 2) {
					return "FourOfAKind";
				}
				return "TwoPair";
			}
			if (jockersCount) {
				return "ThreeOfAKind";
			}
			return "OnePair";
		}

		if (jockersCount) {
			assertJocker([1]);
			return "OnePair";
		}

		return "HighCard";
	}

	private initHand(cards: string[]) {
		for (const card of cards) {
			if (this.isPart2) {
				this.cards.push({
					[card]: FaceToStrength2[card as keyof FacetoStrengthRecord],
				});
			} else {
				this.cards.push({
					[card]: FaceToStrength[card as keyof FacetoStrengthRecord],
				});
			}
		}
	}

	public setHandType(): void {
		if (this.isFiveOfAKind()) {
			this.handType = "FiveOfAKind";
		} else if (this.isFourOfAKind()) {
			this.handType = "FourOfAKind";
		} else if (this.isFullHouse()) {
			this.handType = "FullHouse";
		} else if (this.isHighCard()) {
			this.handType = "HighCard";
		} else if (this.isOnePair()) {
			this.handType = "OnePair";
		} else if (this.isThreeOfAKind()) {
			this.handType = "ThreeOfAKind";
		} else if (this.isTwoPair()) {
			this.handType = "TwoPair";
		}
	}

	public getFaces(): CardName[] {
		const faces: CardName[] = [];

		for (const card of this.cards) {
			faces.push(Object.keys(card)[0]);
		}

		return faces;
	}

	private getFaceMap(faces: CardName[]): Record<keyof Card, number> {
		const faceMap = {} as Record<keyof Card, number>;

		for (const face of faces) {
			!faceMap[face] ? (faceMap[face] = 1) : (faceMap[face] += 1);
		}

		return faceMap;
	}

	/**
	 * all five cards in hand are same
	 * tested using sample2.txt
	 * @returns
	 * @example
	 * "KKKKK"
	 */
	public isFiveOfAKind(): boolean {
		const faces: CardName[] = this.getFaces();
		// console.log("five of a kind faces", faces);

		const faceMap = this.getFaceMap(faces);

		let fives = 0;
		for (const value of Object.values(faceMap)) {
			if (value === 5) {
				fives++;
			}
		}
		if (fives === 1) {
			return true;
		}

		return false;
	}
	/**
	 * four cards share a label
	 *
	 * remaining card is unique
	 * @returns
	 * @example
	 * "TTTT3"
	 */
	public isFourOfAKind(): boolean {
		const faces: string[] = this.getFaces();
		// console.log("four of a kind faces", faces);

		const faceMap = {} as Record<string, number>;

		for (const face of faces) {
			!faceMap[face] ? (faceMap[face] = 1) : (faceMap[face] += 1);
		}

		let fours = 0;
		let unique = 0;
		for (const value of Object.values(faceMap)) {
			if (value === 4) {
				fours++;
			} else if (value === 1) {
				unique++;
			}
		}

		if (fours === 1 && unique === 1) {
			return true;
		}

		return false;
	}
	/**
	 * three cards have same label
	 *
	 * two cards have same label
	 * @returns
	 * @example
	 * "TTKKK"
	 */
	public isFullHouse(): boolean {
		const faceMap = this.getFaceMap(this.getFaces());

		let pairs = 0;
		let threes = 0;
		for (const value of Object.values(faceMap)) {
			if (value === 3) {
				threes++;
			} else if (value === 2) {
				pairs++;
			}
		}

		if (pairs === 1 && threes === 1) {
			return true;
		}

		return false;
	}
	/**
	 * three cards have same label
	 *
	 * all others are unique
	 * @returns
	 * @example
	 * "333KQ"
	 */
	public isThreeOfAKind(): boolean {
		const faceMap = this.getFaceMap(this.getFaces());
		// console.log("face map", faceMap);

		let threes = 0;
		let unique = 0;
		for (const value of Object.values(faceMap)) {
			if (value === 3) {
				threes++;
			} else if (value === 1) {
				unique++;
			}
		}

		if (threes === 1 && unique === 2) {
			return true;
		}

		return false;
	}
	/**
	 * two pairs of two different cards exist
	 *
	 * all others are unique
	 * @returns
	 * @example
	 * "33QQK"
	 */
	public isTwoPair(): boolean {
		const faceMap = this.getFaceMap(this.getFaces());

		// console.log("facemap", faceMap);

		let pairs = 0;
		let unique = 0;
		for (const value of Object.values(faceMap)) {
			if (value === 2) {
				pairs++;
			} else if (value === 1) {
				unique++;
			}
		}

		if (pairs == 2 && unique === 1) {
			return true;
		}

		return false;
	}
	/**
	 * two cards share one label
	 *
	 * all other cards are unique
	 * @returns
	 * @example
	 * "22345"
	 */
	public isOnePair(): boolean {
		const faceMap = this.getFaceMap(this.getFaces());

		let pairs = 0;
		let unique = 0;
		for (const value of Object.values(faceMap)) {
			if (value === 2) {
				pairs++;
			} else if (value === 1) {
				unique++;
			}
		}

		if (pairs === 1 && unique === 3) {
			return true;
		}

		return false;
	}
	/**
	 * all cards labels are unique
	 * @returns
	 * @example
	 * "12345"
	 */
	public isHighCard(): boolean {
		const faces: string[] = this.getFaces();
		// console.log("high card faces", faces);

		// convert to set then you know its all unique

		const faceSet = new Set<string>(faces);

		// console.log("face set", faceSet);

		if (faceSet.size === 5) {
			return true;
		}

		return false;
	}
}

function testHand(hand: Hand, bid: string) {
	// console.log("==========================");
	// console.log(hand, "\nbid", bid);
	// console.log("~~~~~~~~~~~~ \nchecking hand TYPE");
	// console.log("IS FIVE OF A KIND HAND =>", hand.isFiveOfAKind());
	// console.log("IS FOUR OF A KIND HAND =>", hand.isFourOfAKind());
	// console.log("IS THREE OF A KIND HAND =>", hand.isThreeOfAKind());
	// console.log("IS HIGH CARD HAND =>", hand.isHighCard());
	// console.log("IS TWO PAIR HAND =>", hand.isTwoPair());
	// console.log("IS FULL HOUSE HAND =>", hand.isFullHouse());
	// console.log("~~~~~~~~~~~~ ");
	// console.log("==========================");
}

class HandTypeMap<K extends HandType = HandType, V extends number = number> extends Map<K, V> {
	/**
	 * @override
	 */
	public unsafeGet(key: K): V {
		return this.get(key)!;
	}
}

(function main1() {
	const hands: Record<string, Hand> = {};
	const checkHandsAreUnique = {} as Record<string, number>;

	for (const line of lines) {
		const [cards, bid] = line.split(" ");

		// just checking if there are duplicate hands as an edge case that might happen....
		!checkHandsAreUnique[cards]
			? (checkHandsAreUnique[cards] = 1)
			: (checkHandsAreUnique[cards] += 1);

		const hand = new Hand(cards.split(""), Number(bid));
		hands[hand.id] = hand;
		// console.log(cards.split(""), "\n", hand);
		// testHand(hand, bid);
	}

	// let areUnique = true;
	// for (const value of Object.values(checkHandsAreUnique)) {
	// 	if (value === 2) {
	// 		areUnique = false;
	// 		break;
	// 	}
	// }
	// console.log(areUnique);

	const handTypeMap = new HandTypeMap();

	for (const hand of Object.values(hands)) {
		if (!handTypeMap.has(hand.handType)) {
			handTypeMap.set(hand.handType, 1);
		} else {
			handTypeMap.set(hand.handType, handTypeMap.unsafeGet(hand.handType) + 1);
		}
	}

	// sort hands by type lowest strength to highest strength
	const sortedHandsByTypeStrength: Hand[] = Object.values(hands).sort((aHand, bHand) => {
		if (HandTypeToStrength[aHand.handType] < HandTypeToStrength[bHand.handType]) {
			return -1;
		} else if (HandTypeToStrength[aHand.handType] === HandTypeToStrength[bHand.handType]) {
			return 0;
		} else {
			return 1;
		}
	});

	// console.log("==========================");
	// console.log("sorted by type strength");

	for (let i = 0; i < sortedHandsByTypeStrength.length; i++) {
		const hand = sortedHandsByTypeStrength[i];
		const count = handTypeMap.unsafeGet(hand.handType);
		const handsWithType = Object.values(hands).filter((h) => h.handType === hand.handType);
		if (count > 1) {
			// somehow figure out how each hand with the same type will rank against eachother
			const sortedHandsWithTypeByStrength = handsWithType.sort((aHand, bHand) => {
				const aChars = aHand.id.split("") as Array<keyof FacetoStrengthRecord>;
				const bChars = bHand.id.split("") as Array<keyof FacetoStrengthRecord>;
				let result = 0;
				let i = 0;
				while (i < aChars.length) {
					const achar = aChars[i];
					const bchar = bChars[i];

					if (FaceToStrength[achar] < FaceToStrength[bchar]) {
						result = -1;
						break;
					} else if (FaceToStrength[achar] === FaceToStrength[bchar]) {
						i++;
						continue;
					} else if (FaceToStrength[achar] > FaceToStrength[bchar]) {
						result = 1;
						break;
					}

					i++;
				}
				return result;
			});
			// console.log("\x1b[32m", "sorted hands by type strength", "\x1b[00m");
			// console.log(sortedHandsWithTypeByStrength);
			// assign ranks to the sorted hands with the same type
			// skip ahead by however many cards we ranked here that all have the same type
			sortedHandsWithTypeByStrength.forEach((hand, index) => {
				hands[hand.id].rank = i + index + 1;
			});
			i += handsWithType.length - 1;
		} else {
			hands[handsWithType[0].id].rank = i + 1;
		}
	}
	// console.log("==========================");
	let sum = 0;
	for (const hand of Object.values(hands)) {
		sum += hand.bid * hand.rank;
	}
	// console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
	// console.log(hands);
	// 251072643 is too high ....
	// 250951660 ?? YES1!!!!!!!
	console.log("part1", sum);
})();

const CARDS = {
	A: 14,
	K: 13,
	Q: 12,
	J: 11,
	T: 10,
	"9": 9,
	"8": 8,
	"7": 7,
	"6": 6,
	"5": 5,
	"4": 4,
	"3": 3,
	"2": 2,
} as const;

const JOCKER_CARDS = { ...CARDS, J: 1 } as const;

type Card2 = keyof typeof CARDS;

const HAND_TYPES = {
	"Five of a kind": 7,
	"Four of a kind": 6,
	"Full house": 5,
	"Three of a kind": 4,
	"Two pair": 3,
	"One pair": 2,
	"High card": 1,
};

type HandType2 = keyof typeof HAND_TYPES;

type CardsCountMap = { [card in string]: number };

type Hand2 = {
	bid: number;
	cards: string;
	cardsCountMap: CardsCountMap;
	type: HandType2;
};

const solution = solve(readLines());
console.log(solution);

function readLines() {
	return lines;
}

function solve(inputLines: string[]) {
	return {
		// part1: getTotalWinnings(inputLines),
		part2: getTotalWinnings(inputLines, true),
	};
}

function getTotalWinnings(inputLines: string[], part2: boolean = false) {
	const hands = inputLines.map((line) => createHand(line, part2));
	const sortedHands = hands.sort((a, b) => compareHands(a, b, part2));
	return sortedHands.map((hand, i) => hand.bid * (i + 1)).reduce((sum, x) => sum + x, 0);
}

function createHand(inputLine: string, withJoker: boolean): Hand2 {
	const [cards, bidStr] = inputLine.split(" ");

	const bid = parseInt(bidStr, 10);
	const cardsCountMap = countHand(cards);
	const type = getHandType(cardsCountMap, withJoker);

	return {
		bid,
		cards,
		cardsCountMap,
		type,
	};
}

function countHand(cards: string): CardsCountMap {
	return cards.split("").reduce<CardsCountMap>((map, card) => {
		map[card] = (map[card] ?? 0) + 1;
		return map;
	}, {});
}

function getHandType(map: CardsCountMap, withJoker: boolean): HandType2 {
	const keys = Object.keys(map);
	const keysLength = keys.length;
	const counts = Object.values(map);
	const jockersCount = !withJoker ? 0 : map["J"] ?? 0;

	function assertJocker(counts: number[]) {
		if (jockersCount && !counts.includes(jockersCount)) {
			throw `Unhandled jocker, ${JSON.stringify(map, null, 2)}`;
		}
	}

	if (keysLength === 1) {
		assertJocker([5]);
		return "Five of a kind";
	}

	if (keysLength === 2) {
		assertJocker([1, 2, 3, 4]);
		if (jockersCount) {
			return "Five of a kind";
		}
		if (counts.includes(4)) {
			return "Four of a kind";
		}
		return "Full house";
	}

	if (counts.includes(3)) {
		assertJocker([1, 3]);
		if (jockersCount) {
			return "Four of a kind";
		}
		return "Three of a kind";
	}

	if (counts.includes(2)) {
		assertJocker([1, 2]);

		const numOfPairs = counts.reduce(
			(numOfPairs, count) => (count === 2 ? numOfPairs + 1 : numOfPairs),
			0
		);

		if (numOfPairs > 1) {
			if (jockersCount === 1) {
				return "Full house";
			}
			if (jockersCount === 2) {
				return "Four of a kind";
			}
			return "Two pair";
		}
		if (jockersCount) {
			return "Three of a kind";
		}
		return "One pair";
	}

	if (jockersCount) {
		assertJocker([1]);
		return "One pair";
	}

	return "High card";
}

function compareHands(handA: Hand2, handB: Hand2, part2: boolean) {
	if (handA.type === handB.type) {
		return compareUsingSecondOrderingRule(handA.cards, handB.cards, part2);
	}
	return HAND_TYPES[handA.type] - HAND_TYPES[handB.type];
}

function compareUsingSecondOrderingRule(cardsA: string, cardsB: string, part2: boolean = false) {
	const values = part2 ? JOCKER_CARDS : CARDS;
	for (let i = 0; i < cardsA.length; i++) {
		const a = cardsA[i] as Card2;
		const b = cardsB[i] as Card2;
		if (values[a] === values[b]) {
			continue;
		}
		return values[a] - values[b];
	}
	return 0;
}
