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
};

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
};

class Hand {
	public cards: Partial<FacetoStrengthRecord & { bid: number }>[] = [];
	public handType: HandType = null as any;
	public rank = 0;
	public bid = 0;
	public id = "";

	public constructor(cards: string[], bid: number) {
		this.id = cards.join("");
		this.bid = bid;
		this.initHand(cards);
	}

	private initHand(cards: string[]) {
		for (const card of cards) {
			this.cards.push({
				[card]: FaceToStrength[card as keyof FacetoStrengthRecord],
			});
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

	private getFaces(): string[] {
		const faces: string[] = [];

		for (const card of this.cards) {
			faces.push(Object.keys(card)[0]);
		}

		return faces;
	}

	/**
	 * all five cards in hand are same
	 * tested using sample2.txt
	 * @returns
	 * @example
	 * "KKKKK"
	 */
	public isFiveOfAKind(): boolean {
		const faces: string[] = this.getFaces();
		// console.log("five of a kind faces", faces);

		const faceMap = {} as Record<string, number>;

		for (const face of faces) {
			!faceMap[face] ? (faceMap[face] = 1) : (faceMap[face] += 1);
		}

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
		const faces: string[] = this.getFaces();
		// console.log("full house faces", faces);

		const faceMap = {} as Record<string, number>;

		for (const face of faces) {
			if (!faceMap[face]) {
				faceMap[face] = 1;
			} else {
				faceMap[face] += 1;
			}
		}

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
		const faces: string[] = this.getFaces();
		// console.log("three of a kind faces", faces);
		const faceMap = {} as Record<string, number>;

		for (const face of faces) {
			!faceMap[face] ? (faceMap[face] = 1) : (faceMap[face] += 1);
		}
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
		const faces: string[] = this.getFaces();
		// console.log("two pair faces", faces);

		const faceMap = {} as Record<string, number>;

		for (const face of faces) {
			if (!faceMap[face]) {
				faceMap[face] = 1;
			} else {
				faceMap[face] += 1;
			}
		}

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
		const faces: string[] = this.getFaces();
		// console.log("one pair faces", faces);

		const faceMap = {} as Record<string, number>;

		for (const face of faces) {
			if (!faceMap[face]) {
				faceMap[face] = 1;
			} else {
				faceMap[face] += 1;
			}
		}

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
		hand.setHandType();
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

	console.log("==========================");
	console.log("sorted by type strength");

	for (let i = 0; i < sortedHandsByTypeStrength.length; i++) {
		const hand = sortedHandsByTypeStrength[i];
		const count = handTypeMap.unsafeGet(hand.handType);
		if (count === 1 && hand.handType === "FiveOfAKind") {
			hands[hand.id].rank = sortedHandsByTypeStrength.length;
		} else if (
			(count === 1 && hand.handType === "HighCard") ||
			(count === 1 && hand.handType === "OnePair")
		) {
			hands[hand.id].rank = 1;
		} else if (count > 1) {
			const handsWithType = Object.values(hands).filter((h) => h.handType === hand.handType);
			// somehow figure out how each hand with the same type will rank against eachother
			const sortedHandsWithTypeByStrength = handsWithType.sort((aHand, bHand) => {
				const aChars = aHand.id.split("") as Array<keyof FacetoStrengthRecord>;
				const bChars = bHand.id.split("") as Array<keyof FacetoStrengthRecord>;
				let result = 0;
				outer: for (const a_char of aChars) {
					inner: for (const b_char of bChars) {
						// somehow this will put the highest ranking as earlier index in the array
						if (FaceToStrength[a_char] < FaceToStrength[b_char]) {
							result = 1;
							break outer;
						} else if (FaceToStrength[a_char] === FaceToStrength[b_char]) {
							result = 0;
							break inner;
						} else {
							result = -1;
							break outer;
						}
					}
				}
				return result;
			});
			console.log("\x1b[32m", "sorted hands by type strength", "\x1b[00m");
			console.log(sortedHandsWithTypeByStrength);
			// assign ranks to the sorted hands with the same type
			// skip ahead by however many cards we ranked here that all have the same type
			i += handsWithType.length - 1;
		}
	}
	console.log("==========================");

	console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
	// console.log(hands);

	console.log("part1", null);
})();
(function main2() {
	// console.log("part2", null);
})();
