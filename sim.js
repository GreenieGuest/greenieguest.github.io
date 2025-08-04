const simtext = document.getElementById("gameEvents");
const leaderboard = document.getElementById("leaderboard");
const placementBoard = document.getElementById("placements");
const season_name = "Algicosathlon with Stats";
const names = ["Red", "Orange", "Tan", "Yellow", "Lime", "Green", "Cyan", "Blue", "Navy", "Purple", "Pink", "Lavender", "Magenta", "Gray", "Brown", "Olive"];
const colors = ["red", "orange", "tan", "yellow", "#00ff00", "darkgreen", "cyan", "blue", "darkblue", "#6400c8", "lightpink", "#c996ff", "#ff00ff", "#646464", "#643200", "#808000"];
const base_points = [100, 70, 50, 40, 30, 25, 20, 15, 12, 10, 8, 6, 4, 3, 2, 1];

function check() {
	simtext.innerHTML = "prankd";
}

let bootOrder = [];
let challenges = [];
let round = 1;

class Player {
    constructor(name, points, finalePoints, lastPlacement, str, dex, itl) {
        this.name = name;
        this.points = points;
        this.finalePoints = finalePoints;
        this.lastPlacement = lastPlacement;
        this.str = str;
        this.dex = dex;
        this.itl = itl;
    }
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
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

function challenge(challenge, player) {
    let earnedPoints = 0;

    switch (challenge) {
        case "Running (100yd)":
            for (let x = 0; x < 10; x++) {
                earnedPoints += randomInt(1, player.dex);
            }
            break;
        case "Archery":
            for (let x = 0; x < 4; x++) {
                earnedPoints += randomInt(1, player.dex);
            }
            break;
        case "PSaT":
            for (let x = 0; x < 4; x++) {
                earnedPoints += randomInt(1, player.itl);
            }
            break;
        case "BMX Cycling":
            for (let x = 0; x < 4; x++) {
                earnedPoints += randomInt(1, player.str);
            }
            for (let x = 0; x < 4; x++) {
                earnedPoints += randomInt(1, player.dex);
            }
            break;
        case "Obstacle Course":
            for (let x = 0; x < 4; x++) {
                earnedPoints += randomInt(1, player.dex);
            }
            for (let x = 0; x < 4; x++) {
                earnedPoints += randomInt(1, player.itl);
            }
            break;
        case "Ninja Takedown":
            for (let x = 0; x < 4; x++) {
                earnedPoints += randomInt(1, player.str);
            }
            for (let x = 0; x < 4; x++) {
                earnedPoints += randomInt(1, player.itl);
            }
            break;
        case "The Ultimate Test of Your Sheer Willpower":
            for (let x = 0; x < 4; x++) {
                earnedPoints += randomInt(1, player.str);
            }
            for (let x = 0; x < 4; x++) {
                earnedPoints += randomInt(1, player.dex);
            }
            for (let x = 0; x < 4; x++) {
                earnedPoints += randomInt(1, player.itl);
            }
            break;
        case "Maxing":
            var playerRoll = 1;
            while (playerRoll > 0) {
                playerRoll = randomInt(0, player.str);
                earnedPoints += 1;
            }
            break;
        case "The FitnessGram Pacer Test":
            var playerRoll = 1;
            while (playerRoll > 0) {
                playerRoll = randomInt(0, player.dex);
                earnedPoints += 1;
            }
            break;
        case "The ASCI Spelling Bee":
            var playerRoll = 1;
            while (playerRoll > 0) {
                playerRoll = randomInt(0, player.itl);
                earnedPoints += 1;
            }
            break;
        case "Pole Vault":
            let playerRoll1 = randomInt(1, player.str);
            let playerRoll2 = randomInt(1, player.dex);
            earnedPoints = (playerRoll1 * playerRoll2);
            break;
        case "Discus Throw":
            for (let x = 0; x < 4; x++) {
                earnedPoints += randomInt(1, player.str);
            }
            break;
        default:
            earnedPoints = randomInt(1, 20);
    }

    return earnedPoints;
}

function challengeMerge(ultimateShowdown, showdownRound, challenges, athletes) {
    let challengeName;
    if (ultimateShowdown) {
        challengeName = challenges[showdownRound];
    } else {
        const challengeTypes = ["Running (100yd)", "Archery", "PSaT", "BMX Cycling", "Obstacle Course", "Ninja Takedown", "The Ultimate Test of Your Sheer Willpower", "Maxing", "The FitnessGram Pacer Test", "The ASCI Spelling Bee", "Pole Vault", "Discus Throw"];
        challengeName = randomChoice(challengeTypes);
        challenges.push(challengeName);
    }

    let playerPoints = Array(athletes.length).fill(0);
    displayText(`Challenge: ${challengeName}`);

    for (let player = 0; player < athletes.length; player++) {
        playerPoints[player] = challenge(challengeName, athletes[player]);
    }

    let placements = [...playerPoints];
    placements.sort((a, b) => b - a);
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
		let [placements, score] = challengeMerge(false, 0, challenges, athletes);
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
			let [challengeResults, scores] = challengeMerge(true, x, challenges, athletes);
			let challengeWinner = athletes[challengeResults[0]];
			if (scores[0] === scores[1]) {
				displayText(`Round ${x + 1}: Draw, status quo. | ${athletes[0].name}: ${athletes[0].finalePoints}, ${athletes[1].name}: ${athletes[1].finalePoints}\n`);
			} else {
				challengeWinner.finalePoints += 1;
				displayText(`Round ${x + 1}: ${challengeWinner.name} wins. | ${athletes[0].name}: ${athletes[0].finalePoints}, ${athletes[1].name}: ${athletes[1].finalePoints}\n`);
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

let athletes = names.map(item => new Player(item, 0, 0, 0, randomInt(1, 6), randomInt(1, 6), randomInt(1, 6)));

let castSize = athletes.length;
let numPlayers = athletes.length;

document.getElementById("proceed").addEventListener("click", nextRound);