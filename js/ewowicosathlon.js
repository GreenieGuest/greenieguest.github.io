const simtext = document.getElementById("gameEvents");
const leaderboard = document.getElementById("leaderboard");
const placementBoard = document.getElementById("placements");
const elimText = document.getElementById("elimination");
const season_name = "Ewowicosathlon";
const base_points = [100, 70, 50, 40, 30, 25, 20, 15, 12, 10, 8, 6, 4, 3, 2, 1];

const names = [];
const colors = [];

const roundScores = Array.from({ length: 16 }, () => []);

let athletes = [];
let bootOrder = [];
let challenges = [];
let round = 1;
let castSize = 16;
let numPlayers = 16;

function load() {
	//Reset all variables
	names.splice(0, names.length);
	colors.splice(0, colors.length);
	for (let i = 0; i < 15; i++) {
		roundScores[i].splice(0, roundScores[i].length);
	}
	athletes = [];
	bootOrder = [];
	challenges = [];
	round = 1;
	numPlayers = 16;
	//Fetch each contestant data from predetermined json file :D
	fetch('ewowicosathlon.json')
	.then(response => response.json())
	.then(jsonData => {
		jsonData.forEach((entry, index) => {
			names.push(entry.contestant);		 
			colors.push(entry.color);
			
			for (let i = 0; i < 15; i++) {
				roundScores[index].push(entry[`r${i + 1}`]);
			}
		});

		const sample = sample(names, castSize);
		
		athletes = sample.map((item, index) => new Player(item, 0, index, roundScores[names.indexOf(item)]));
		stillInTheRunning(athletes, false);
	})
	.catch(error => {
	let data = {"contestants":[
	{
		"contestant": "#1 sigma Rizz lord",
		"color": "#bf9000",
		"r1": 489,
		"r2": 203,
		"r3": 125,
		"r4": 450,
		"r5": 575,
		"r6": 873,
		"r7": 135,
		"r8": 1,
		"r9": 2,
		"r10": 22,
		"r11": 52,
		"r12": 30,
		"r13": 38,
		"r14": 95
	},
	{
		"contestant": "4DJumpman256",
		"color": "#6ed974",
		"r1": 632,
		"r2": 58,
		"r3": 20,
		"r4": 195,
		"r5": 206,
		"r6": 73,
		"r7": 37,
		"r8": 465,
		"r9": 190,
		"r10": 27,
		"r11": 31,
		"r12": 72,
		"r13": 31,
		"r14": 170
	},
	{
		"contestant": "Brandy?",
		"color": "#e47d63",
		"r1": 2785,
		"r2": 536,
		"r3": 674,
		"r4": 207,
		"r5": 515,
		"r6": 264,
		"r7": 1103,
		"r8": 98,
		"r9": 332,
		"r10": 1,
		"r11": 4,
		"r12": 20,
		"r13": 10,
		"r14": 39
	},
	{
		"contestant": "CloudySkyes",
		"color": "#ffdcf0",
		"r1": 6018,
		"r2": 223,
		"r3": 880,
		"r4": 864,
		"r5": 1724,
		"r6": 108,
		"r7": 368,
		"r8": 82,
		"r9": 33,
		"r10": 35,
		"r11": 38,
		"r12": 2,
		"r13": 9,
		"r14": 33
	},
	{
		"contestant": "Dark",
		"color": "#0b5394",
		"r1": 1012,
		"r2": 847,
		"r3": 186,
		"r4": 639,
		"r5": 97,
		"r6": 56,
		"r7": 54,
		"r8": 83,
		"r9": 128,
		"r10": 20,
		"r11": 90,
		"r12": 69,
		"r13": 113,
		"r14": 43
	},
	{
		"contestant": "GreenieGuest",
		"color": "#6aa84f",
		"r1": 2733,
		"r2": 1410,
		"r3": 15,
		"r4": 114,
		"r5": 319,
		"r6": 478,
		"r7": 456,
		"r8": 97,
		"r9": 20,
		"r10": 21,
		"r11": 16,
		"r12": 153,
		"r13": 60,
		"r14": 19
	},
	{
		"contestant": "J_duude",
		"color": "#00ff00",
		"r1": 667,
		"r2": 1939,
		"r3": 84,
		"r4": 288,
		"r5": 53,
		"r6": 376,
		"r7": 307,
		"r8": 70,
		"r9": 13,
		"r10": 83,
		"r11": 98,
		"r12": 22,
		"r13": 71,
		"r14": 83
	},
	{
		"contestant": "JujuMas",
		"color": "#980000",
		"r1": 4959,
		"r2": 70,
		"r3": 209,
		"r4": 547,
		"r5": 9,
		"r6": 400,
		"r7": 202,
		"r8": 202,
		"r9": 9,
		"r10": 283,
		"r11": 9,
		"r12": 44,
		"r13": 50,
		"r14": 11
	},
	{
		"contestant": "losered",
		"color": "#ff0000",
		"r1": 50,
		"r2": 485,
		"r3": 92,
		"r4": 120,
		"r5": 403,
		"r6": 218,
		"r7": 11,
		"r8": 12,
		"r9": 36,
		"r10": 30,
		"r11": 51,
		"r12": 10,
		"r13": 7,
		"r14": 117
	},
	{
		"contestant": "Purplegaze",
		"color": "#9900ff",
		"r1": 528,
		"r2": 96,
		"r3": 274,
		"r4": 760,
		"r5": 5,
		"r6": 16,
		"r7": 89,
		"r8": 778,
		"r9": 184,
		"r10": 28,
		"r11": 7,
		"r12": 83,
		"r13": 61,
		"r14": 30
	},
	{
		"contestant": "reremiau",
		"color": "#8e7cc3",
		"r1": 90,
		"r2": 625,
		"r3": 3139,
		"r4": 47,
		"r5": 373,
		"r6": 516,
		"r7": 97,
		"r8": 96,
		"r9": 234,
		"r10": 78,
		"r11": 14,
		"r12": 17,
		"r13": 2,
		"r14": 23
	},
	{
		"contestant": "scorb",
		"color": "#ff00ff",
		"r1": 371,
		"r2": 10,
		"r3": 43,
		"r4": 2143,
		"r5": 109,
		"r6": 2,
		"r7": 369,
		"r8": 59,
		"r9": 24,
		"r10": 60,
		"r11": 10,
		"r12": 34,
		"r13": 12,
		"r14": 8
	},
	{
		"contestant": "Snoozingnewt",
		"color": "#c9dbf9",
		"r1": 2703,
		"r2": 402,
		"r3": 573,
		"r4": 53,
		"r5": 209,
		"r6": 304,
		"r7": 69,
		"r8": 357,
		"r9": 108,
		"r10": 384,
		"r11": 50,
		"r12": 11,
		"r13": 58,
		"r14": 12
	},
	{
		"contestant": "ThePinkBunnyEmpire",
		"color": "#ffa7fd",
		"r1": 9556,
		"r2": 12,
		"r3": 1487,
		"r4": 1554,
		"r5": 7,
		"r6": 272,
		"r7": 281,
		"r8": 4,
		"r9": 16,
		"r10": 132,
		"r11": 6,
		"r12": 21,
		"r13": 13,
		"r14": 51
	},
	{
		"contestant": "TieTiePerson",
		"color": "#9fc5e8",
		"r1": 935,
		"r2": 86,
		"r3": 427,
		"r4": 107,
		"r5": 440,
		"r6": 193,
		"r7": 171,
		"r8": 22,
		"r9": 3,
		"r10": 73,
		"r11": 25,
		"r12": 77,
		"r13": 1,
		"r14": 1
	},
	{
		"contestant": "X_Ry",
		"color": "#64e3ff",
		"r1": 1245,
		"r2": 133,
		"r3": 989,
		"r4": 522,
		"r5": 43,
		"r6": 76,
		"r7": 248,
		"r8": 27,
		"r9": 302,
		"r10": 97,
		"r11": 68,
		"r12": 15,
		"r13": 19,
		"r14": 10
	}
	]};

		data.contestants.forEach((entry, index) => {
			names.push(entry.contestant);		 
			colors.push(entry.color);
			
			for (let i = 0; i < 15; i++) {
				roundScores[index].push(entry[`r${i + 1}`]);
			}
		});
		console.log("Loaded..");
		
		athletes = names.map((item, index) => new Player(item, 0, index, roundScores[index]));
		castSize = athletes.length;
		numPlayers = athletes.length;
		stillInTheRunning(athletes, false);
	});
}

class Player {
    constructor(name, points, lastPlacement, challengeData) {
        this.name = name;
        this.points = points;
        this.lastPlacement = lastPlacement;
        this.challengeData = challengeData;
    }
}

function Elimination(athletes) {
    athletes.sort((a, b) => getPoints(a) - getPoints(b));
    let eliminated = athletes[0];

    athletes.sort((a, b) => getPoints(b) - getPoints(a));
    stillInTheRunning(athletes, true);
    elimText.innerHTML = `${eliminated.name} has been ELIMINATED with ${eliminated.points} points. ${numPlayers - 1} remain.\n`
    athletes.splice(athletes.indexOf(eliminated), 1);

    bootOrder.unshift(eliminated);
}

function displayText(str) {
	const p = document.createElement("p");
	p.innerHTML = str
	
	gameEvents.appendChild(p);
}

function sample(array, n) {
    let result = [];
    let arrCopy = array.slice();
    for (let i = 0; i < n; i++) {
        let idx = Math.floor(Math.random() * arrCopy.length);
        result.push(arrCopy[idx]);
        arrCopy.splice(idx, 1);
    }
    return result;
}

function stillInTheRunning(athletes, update) {
	console.log("Brinted contestant!");
	for (let i = (leaderboard.rows.length - 1); i > 0; i--) {
		leaderboard.deleteRow(i);
	}
    for (let x = 0; x < athletes.length; x++) {
		const row = document.createElement("tr");

		const placement = document.createElement("td");
		placement.textContent = `${x + 1}${suffix(x + 1)}`

		const name = document.createElement("td");
		name.textContent = `${athletes[x].name}`
		name.style.color = colors[names.indexOf(athletes[x].name)]

		const points = document.createElement("td");
		points.textContent = `${athletes[x].points}`
		
		const change = document.createElement("td");
		if (x < athletes[x].lastPlacement) {
			change.textContent = `↑${athletes[x].lastPlacement - x}`
			change.style.color = "green"
		} else if (x > athletes[x].lastPlacement) {
			change.textContent = `↓${x - athletes[x].lastPlacement}`
			change.style.color = "red"
		} else {
			change.textContent = `-`
			change.style.color = "white"
		}
		
		row.appendChild(placement);
		row.appendChild(name);
		row.appendChild(points);
		row.appendChild(change);
		leaderboard.appendChild(row);
		athletes[x].lastPlacement = x;
    }
    for (let x = 0; x < bootOrder.length; x++) {
		const row = document.createElement("tr");

		const placement = document.createElement("td");
		placement.textContent = `${athletes.length + x + 1}${suffix(athletes.length + x + 1)}`

		const name = document.createElement("td");
		name.textContent = `${bootOrder[x].name}`
		name.style.color = colors[names.indexOf(bootOrder[x].name)]

		const points = document.createElement("td");
		points.textContent = `${bootOrder[x].points}`
		
		const change = document.createElement("td");
		change.textContent = "ELIMINATED"
		change.style.color = "red"
		
		row.appendChild(placement);
		row.appendChild(name);
		row.appendChild(points);
		row.appendChild(change);
		leaderboard.appendChild(row);
    }
}

function suffix(n) {
    if (11 <= n % 100 && n % 100 <= 13) {
        return "th";
    } else {
        return {1: "st", 2: "nd", 3: "rd"}[n % 10] || "th";
    }
}

function challenge(athletes) {
    let playerPoints = Array(athletes.length).fill(0);
    displayText(`Round ${round} Prompt`);

    for (let player = 0; player < athletes.length; player++) {
        playerPoints[player] = athletes[player].challengeData[round - 1];
    }

    let placements = [...playerPoints];
    placements.sort((a, b) => a - b);
    let results = [...placements];

    for (let x = 0; x < placements.length; x++) {
        let index = playerPoints.indexOf(placements[x]);
        placements[x] = index;
        playerPoints[index] = 0;
    }

    return [placements, results];
}

function getPoints(player) {
    return player.points;
}

function nextRound() {
	simtext.innerHTML = ""
	if (numPlayers > 1) {
		displayText(`[- Day ${castSize + 1 - numPlayers} -]\n`);
		stillInTheRunning(athletes, false);
    
		for (let i = (placementBoard.rows.length - 1); i > 0; i--) {
			placementBoard.deleteRow(i);
		}
		let [placements, score] = challenge(athletes);
		for (let x = 0; x < placements.length; x++) {
			const row = document.createElement("tr");

			const placement = document.createElement("td");
			placement.textContent = `${x + 1}${suffix(x + 1)}`

			const name = document.createElement("td");
			name.textContent = `${athletes[placements[x]].name}`
			name.style.color = colors[names.indexOf(athletes[placements[x]].name)]

			const points = document.createElement("td");
			points.textContent = `${[score[x]]}`

			const gains = document.createElement("td");
			gains.textContent = `+${Math.ceil(base_points[x] * Math.pow(1.5, round - 1))} points`

			row.appendChild(placement);
			row.appendChild(name);
			row.appendChild(points);
			row.appendChild(gains);
			placementBoard.appendChild(row);
		}
    
		stillInTheRunning(athletes, false);
    
		for (let x = 0; x < placements.length; x++) {
			athletes[placements[x]].points += Math.ceil(base_points[x] * Math.pow(1.5, round - 1));
		}
    
		stillInTheRunning(athletes, false);
    
		Elimination(athletes);
		numPlayers -= 1;
		round += 1;
		
		if (numPlayers == 1) {
			displayText(`${athletes[0].name} wins Ewowicosathlon.`);
			displayText(`Press Proceed to re-simulate.`);
		}
	} else { // Simulate again
		simtext.innerHTML = ""
		elimText.innerHTML = ""
		for (let i = (placementBoard.rows.length - 1); i > 0; i--) {
			placementBoard.deleteRow(i);
		}
		load();
		displayText(`Press Proceed to begin.`);
	}
}

load();
simtext.innerHTML = ""
displayText(`Welcome to EWOWicosathlon! 16 randomly picked contestants will compete in an Algicosathlon based off each round score.`);
displayText(`Press Proceed to begin.`);
document.getElementById("proceed").addEventListener("click", nextRound);
