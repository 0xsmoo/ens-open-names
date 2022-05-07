# Open ENS Name Finder

A tiny CLI tool that finds unowned ENS domains so you can snipe some good ones while they last. Check out `data/` for lists of unowned ENS names as of 5/5/22.


## Setup
1. Make sure you have [Node JS](https://nodejs.org/en/) (with `npm` or `yarn`) installed
2. Clone this repository `git clone https://github.com/0xsmoo/ens-open-names`
3. Install dependencies with `npm install` or `yarn`

## Usage

Run 
`npx ts-node main.ts --infuraAPIKey <your api key> --length <domain length> --outputFile <output filename>`

For example, to find all open ENS domains with 4 characters, you could run
 `npx ts-node main.ts --infuraAPIKey <your api key> --length 4 --outputFile data.json`