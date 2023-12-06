const https = require("https");
const fs = require("fs");

const myargs = process.argv.slice(2);

if (myargs.length === 0) {
    throw new Error(
        "\t\tPLEASE PROVIDE A DAY NUMBER TO THIS SCRIPT THANKS \n\t\t\t === usage: node _getInput.js 1 ===\n\n\n\x1b[00m"
    );
}

const day = myargs[0];
const savePath = `./Day${day}/input.txt`;

const cookie = fs.readFileSync(".env", { encoding: "utf8" });
https.get(
    {
        path: `/2023/day/${day}/input`,
        hostname: "adventofcode.com",
        protocol: "https:",
        headers: {
            // might have to renew the cookie if this expires but mine for now says it expires in like 2 years
            cookie: `session=${cookie}`,
        },
        agentOptions: {
            ca: fs.readFileSync("./cert.cer"),
        },
    },
    (res) => {
        let content = "";
        res.on("data", (chunk) => {
            content += chunk.toString();
        }).on("end", () => {
            console.log(content);
            fs.writeFileSync(savePath, content.trim(), { encoding: "utf8" });
        });
    }
);
