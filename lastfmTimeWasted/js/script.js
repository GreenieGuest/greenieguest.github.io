const textbox = document.getElementById("input");
const dropdown = document.getElementById("type");
const div = document.getElementById("output");
const apiKey = "38453222bd8526be0f30d941903e739f"
//Don't Be Evil -Google

var topArtists = [];
var totalSeconds = 0;

function timeDissect(timeInSeconds) {
	//Function to convert seconds into more useful units
	let days = Math.floor(timeInSeconds / (60 * 60 * 24));
	let hours = Math.floor((timeInSeconds % (60 * 60 * 24)) / (60 * 60));
	let minutes = Math.floor((timeInSeconds % (60 * 60)) / 60);
	let seconds = Math.floor(timeInSeconds % 60);
				
	return [days, hours, minutes, seconds];
}

function timeEquate(timeInSeconds) {
	//Another function to convert seconds into more useful units
	let minutesWasted = (timeInSeconds/60).toFixed(2);
	let hoursWasted = (minutesWasted/60).toFixed(2);
	let daysWasted = (hoursWasted/24).toFixed(2);
				
	return [days, hours, minutes];
}

async function getUserTracks(username, artists) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${username}&api_key=${apiKey}&format=json&autocorrect=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();
		const tracks = data.toptracks.track;
		//Retrieve user's top tracks from last.fm api data
		
		if (tracks) {
			const timePromises = tracks.map(track => getTrackTimeWasted(track.artist.name, track.name, username));
			const results = await Promise.all(timePromises);
			
			clearText()
			
			const totalCounter = document.createElement("h2");
				let [days, hours, minutes, seconds] = timeDissect(totalSeconds);
			totalCounter.innerHTML = `You have wasted ${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds of your life listening to...`;
			
			div.appendChild(totalCounter);
			
			if (artists == false) {
				for (var i = 0; i < results.length; i++) {
					let [days, hours, minutes, seconds] = timeDissect(results[i]);

					displayText(`<b>${tracks[i].artist.name} - ${tracks[i].name}:</b><span style="color: darkgray"> ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds</span>`);
				}
			} else {
				topArtists.forEach(artist => {
					if (artist.totalTimeWasted > 0) {
						let [days, hours, minutes, seconds] = timeDissect(artist.totalTimeWasted);
						displayText(`<b>${artist.name}</b> <span style="color: darkgray">contributed to wasting</span> <b>${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds</b> <span style="color: darkgray">of your life.</span>`);
					}
				});
			}
			

		} else {
			clearText()
			displayText("Sorry, this account hasn't listened to enough artists.")
		}
    } catch (error) {
        console.error("Error getting user top tracks:", error);
		clearText();
		displayText("An error occured. Please try again later");
    }
}

async function getTopArtists(username) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${username}&api_key=${apiKey}&format=json&limit=50`;
    try {
        const response = await fetch(url);
        const data = await response.json();
		const artists = data.topartists.artist;
		
		if (artists) {
			artists.forEach(artist => {
				topArtists.push({
					name: artist.name,
					totalTimeWasted: 0
				});
			});
		} else {
			clearText()
			displayText("Sorry, this account hasn't listened to enough artists.")
		}
    } catch (error) {
        console.error("Error fetching data:", error);
		clearText();
		displayText("Invalid profile");
    }
}
// These functions convert the data in MILLISECONDS to time wasted in SECONDS

async function getTrackTimeWasted(artistName, trackName, username) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${artistName}&track=${trackName}&username=${username}&format=json&autocorrect=1&limit=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();
		const trackInfo = data.track;
		
		var timeWasted = 0;
		
		if (trackInfo && trackInfo.duration && trackInfo.userplaycount) {
			let trackDuration = trackInfo.duration;
			
			//Incomplete data sets setting duration as 0 seconds isn't fun... so we'll assume those songs are the average song length (3-4 minutes)
			if (trackDuration == 0) {trackDuration = 195000;}
			
			timeWasted = (trackDuration/1000)*trackInfo.userplaycount
			totalSeconds += timeWasted;
			
			topArtists.forEach(artist => {
				if (artist.name == trackInfo.artist.name) {
					artist.totalTimeWasted += timeWasted
				}
			});
		}
		
		return timeWasted || 0;
    } catch (error) {
        console.error("Error fetching track duration:", error);
		return 0;
    }
}

function clearText() {
	div.innerHTML = "";
}

function displayText(str) {
	const p = document.createElement("p");
	p.innerHTML = str;
	
	div.appendChild(p);
}

function getTimeWasted() {
	const proceedButton = document.getElementById("proceed");
	proceedButton.disabled = true;
	
	topArtists = []; // make way for new user's stuff
	totalSeconds = 0;

	username = textbox.value;
	category = dropdown.value;
	
	clearText();
	displayText("loading...");
	
	const finished = () => proceedButton.disabled = false;
	 
	if (category == "tracks") {
		getTopArtists(username);
		getUserTracks(username, false).then(finished);
	} else {
		getTopArtists(username);
		getUserTracks(username, true).then(finished);
	}
}

document.getElementById("proceed").addEventListener("click", getTimeWasted);