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

function load() {
	//Reset all variables
	names.splice(0, names.length);
	colors.splice(0, colors.length);
	for (let i = 0; i < 14; i++) {
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
			
			for (let i = 0; i < 14; i++) {
				roundScores[index].push(entry[`r${i + 1}`]);
			}
		});

		const samplecast = sample(names, castSize - 1);
		
		athletes = samplecast.map((item, index) => new Player(item, 0, index, roundScores[names.indexOf(item)]));
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
