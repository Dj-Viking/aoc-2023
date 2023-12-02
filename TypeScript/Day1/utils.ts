export function reverseStr(str: string): string {
    return str.split("").reverse().join("");
}
export function converttonum(word: string): any {
    switch (word) {
        case "one": {
            return 1;
        }
        case "two": {
            return 2;
        }
        case "three": {
            return 3;
        }
        case "four": {
            return 4;
        }
        case "five": {
            return 5;
        }
        case "six": {
            return 6;
        }
        case "seven": {
            return 7;
        }
        case "eight": {
            return 8;
        }
        case "nine": {
            return 9;
        }
        case reverseStr("one"): {
            return 1;
        }
        case reverseStr("two"): {
            return 2;
        }
        case reverseStr("three"): {
            return 3;
        }
        case reverseStr("four"): {
            return 4;
        }
        case reverseStr("five"): {
            return 5;
        }
        case reverseStr("six"): {
            return 6;
        }
        case reverseStr("seven"): {
            return 7;
        }
        case reverseStr("eight"): {
            return 8;
        }
        case reverseStr("nine"): {
            return 9;
        }
        default:
            return Number(word);
    }
}
