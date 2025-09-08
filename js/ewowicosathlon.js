const simtext = document.getElementById("gameEvents");
const leaderboard = document.getElementById("leaderboard");
const placementBoard = document.getElementById("placements");
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
	
	athletes = names.map((item, index) => new Player(item, 0, 0, 0, roundScores[index]));
	castSize = athletes.length;
	numPlayers = athletes.length;
});

class Player {
    constructor(name, points, finalePoints, lastPlacement, challengeData) {
        this.name = name;
        this.points = points;
        this.finalePoints = finalePoints;
        this.lastPlacement = lastPlacement;
        this.challengeData = challengeData;
    }
}

function Elimination(athletes) {
    athletes.sort((a, b) => getPoints(a) - getPoints(b));
    let eliminated = athletes[0];

    athletes.sort((a, b) => getPoints(b) - getPoints(a));
    stillInTheRunning(athletes, true);
    console.log(`${eliminated.name} has been ELIMINATED with ${eliminated.points} points. ${numPlayers - 1} remain.\n`);
    athletes.splice(athletes.indexOf(eliminated), 1);

    bootOrder.unshift(eliminated);
}

function displayText(str) {
	const p = document.createElement("p");
	p.innerHTML = str
	
	gameEvents.appendChild(p);
}

function stillInTheRunning(athletes, update) {
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
    displayText(`Challenge: ${challengeName}`);

    for (let player = 0; player < athletes.length; player++) {
        playerPoints[player] = challenge(challengeName, athletes[player].challengeData[round - 1]);
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
	if (numPlayers > 2) {
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
	} else {
		stillInTheRunning(athletes, false);
		document.getElementById("proceed").remove()
		placementBoard.remove()
		displayText(`[- Day ${castSize} -]\n`);
		displayText("The final challenge, to decide which of the final 2 wins, is a marathon of every previous challenge in order. The player with the most wins at the end wins the season.");

		// Ultimate Showdown

		for (let x = 0; x < castSize - 2; x++) {
			if (athletes[0].roundScores[x] < athletes[1].roundScores[x]) {
				athletes[0].finalePoints += 1;
				displayText(`Round ${x + 1}: ${athletes[0].name} wins. | ${athletes[0].name}: ${athletes[0].finalePoints}, ${athletes[1].name}: ${athletes[1].finalePoints}\n`);
			} else {
				athletes[1].finalePoints += 1;
				displayText(`Round ${x + 1}: ${athletes[1].name} wins. | ${athletes[0].name}: ${athletes[0].finalePoints}, ${athletes[1].name}: ${athletes[1].finalePoints}\n`);
			}
		}

		let runnerUp = null;
		if (athletes[0].finalePoints < athletes[1].finalePoints) {
			runnerUp = athletes[0];
		} else if (athletes[1].finalePoints < athletes[0].finalePoints) {
			runnerUp = athletes[1];
		} else {
			console.log("The votes tied, so a loser will be randomly chosen.");
			runnerUp = randomChoice(athletes);
		}

		athletes.splice(athletes.indexOf(runnerUp), 1);
		displayText(`${runnerUp.name} failed to win and was eliminated in 2nd.`);
		numPlayers -= 1;
		bootOrder.unshift(runnerUp);

		let winner = randomChoice(athletes);
		bootOrder.unshift(winner);
		athletes.splice(athletes.indexOf(winner), 1);
		displayText(`${winner.name} is the winner of ${season_name}.`);
	}
}

document.getElementById("proceed").addEventListener("click", nextRound);
