// DILIGORD FUN THING
// Version 1.0
// MIT License

// Copyright (c) 2020 Eli Johnson

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.



// Declare global variables
let abominations;   // The list of abominations
let selected = [];  // Contains the currently selected abominations
let logTimeout;



/**
 * Generate a random name.
 * @returns {String} The name.
 */
function genName() {
    // Possibilities is defined in NAMES.JS not this document!

    // Get name parts
    let firstName = (randInt(0,50) == 0 ? '' : possibilities[randInt(0, possibilities.length - 1)]) + possibilities[randInt(0, possibilities.length - 1)]
    let lastName = (randInt(0,50) == 0 ? '' : possibilities[randInt(0, possibilities.length - 1)]) + possibilities[randInt(0, possibilities.length - 1)]
    let alpha = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']

    // Assemble names
    return `${capitalize(firstName)} ${alpha[randInt(0, alpha.length - 1)].toUpperCase()}. ${capitalize(lastName)}`
}



/**
 * Capitilizes the first character of a string.
 * @param {String} x The string.
 * @returns {String} The capitalized string.
 */
function capitalize(x) {
    return x.charAt(0).toUpperCase() + x.slice(1)
}



/**
 * Returns a random integer between two values.
 * @param {Number} min The minimum value.
 * @param {Number} max The maximum value.
 * @returns {Number} The random integer.
 */

function randInt(min, max) {
    return Math.round((Math.random() * (max - min)) + min);
}



/**
 * Computes the average of two hues.
 * @param {Number} hue1 The first hue.
 * @param {Number} hue2 The second hue.
 * @returns {Number} The average of the two hues.
 */
function averageHues(hue1, hue2) {
	let diff = ( ( hue1 - hue2 + 180 + 360 ) % 360 ) - 180;
	let angle = (360 + hue2 + ( diff / 2 ) ) % 360;
	return angle;
}



/**
 * Display a message for 5 seconds.
 * @param {String} message The message.
 */

function log(message) {
    // blue = &0
    // pink = &1
    // red = &2
    // reset = &r
    // red bg = !2

    message = message.replaceAll('&0','<p style="color: #344a8a;">');
    message = message.replaceAll('&1','<p style="color: #8a337b;">');
    message = message.replaceAll('&2','<p style="color: #8a222b;">');
    message = message.replaceAll('&r','</p>');

    if (message.startsWith('!2')) {
        document.getElementById("message").style.backgroundColor = "#F1674F";
        document.getElementById("message").style.color = "white";
        message = message.replaceAll('!2','')
    } else {
        document.getElementById("message").style.backgroundColor = "white";
        document.getElementById("message").style.color = "black";
    }


    document.getElementById("message").style.opacity = "100%";
    document.getElementById("message").style.visibility = "visible";
    document.getElementById("message").innerHTML = `<b>${message}</b>`;

    if (logTimeout) clearTimeout(logTimeout)

    logTimeout = setTimeout(() => { document.getElementById("message").style.opacity = "0%"; document.getElementById("message").style.visibility = "hidden"; }, 5000);
}



/**
 * Represents a single abomination.
 */
let abomination = class {
    constructor(speed=randInt(0, 10), health=randInt(0, 10), owengayness=randInt(0, 10), mentalspeed=randInt(0, 10), gamer=randInt(0, 10),
                obesity=randInt(0, 10), gender=randInt(1, 2), maxmut=randInt(1, 2), race=randInt(0, 360), name=genName(), generation=0, children=0) {

        if (name === "Eli C. Johnson") {
            // Set properties
            this.speed = 10;
            this.health = 10;
            this.owengayness = 0;
            this.mentalspeed = 10;
            this.gamer = 10;
            this.obesity = 0;
            this.gender = 1;
            this.maxmut = 0;
            this.race = 10;
            this.name = name;
            this.generation = generation;
            this.children = children;

            // Set lifespan (24 hours)
            this.lifespan = 24 * 60 * 60;
            this.isAlive = true;
        }
        else {
            // Set properties
            this.speed = speed;
            this.health = health;
            this.owengayness = owengayness;
            this.mentalspeed = mentalspeed;
            this.gamer = gamer;
            this.obesity = obesity;
            this.gender = gender;
            this.maxmut = maxmut;
            this.race = race;
            this.name = name;
            this.generation = generation;
            this.children = children;

            // Generate lifespan (0.5-2 minutes)
            this.lifespan = randInt(0.5 * 60, 2 * 60);
            this.isAlive = true;
        }

        // Make abomination die after it's lifespan ends
        setTimeout(() => {
            this.isAlive = false;
            renderAbominations();
        }, this.lifespan * 1000);
    }
}



/**
 * Toggle whether an abomination is selected. If 2 abominations are selected they will be breed together.
 * @param {Number} id The ID of the abomination to select.
 */
function selectAbomination(id) {
    // Make sure abomination is alive
    if (!abominations[id].isAlive) {
        log("!2You can't select dead abominations!");
        return;
    }

    // Toggle whether abomination is selected
    if (selected.includes(abominations[id])) {
        // Unselect abomination
        selected.splice(selected.indexOf(abominations[id]), 1);
    }
    else {
        // Select abomination
        selected.push(abominations[id]);

        // Update twitter button
        document.getElementById(`twitter`).onclick = function(){window.open(`https://twitter.com/intent/tweet?text=I+just+bred+${abominations[id].name.split(" ").join("+")}+in+%23Breed!+<LINK>".`)}
        document.getElementById(`twitter`).innerHTML = `<img src="images/twittericon.png"><p>Tweet about <b>${abominations[id].name}</b>!</p>`
    }

    // Check if it's time to breed
    if (selected.length == 2) {
        // Breed abominations
        breed(selected[0], selected[1]);
    }
    else {
        // Re-render abominations (bc selection was updated)
        renderAbominations();
    }
}



/**
 * Breed two abominations and update the UI.
 * @param {abomination} a The first abomination.
 * @param {abomination} b The second abomination.
 */
function breed(a, b) {
    // Remove selections
    selected = [];

    // Make sure they're not the same gender
    if (a.gender == b.gender) {
        document.getElementById(`abominations${abominations.indexOf(a)}`).classList.remove("selected");
        document.getElementById(`abominations${abominations.indexOf(b)}`).classList.remove("selected");

        document.getElementById(`abominations${abominations.indexOf(a)}`).classList.add("error");
        document.getElementById(`abominations${abominations.indexOf(b)}`).classList.add("error");

        setTimeout(() => {
            document.getElementById(`abominations${abominations.indexOf(a)}`).classList.remove("error");
            document.getElementById(`abominations${abominations.indexOf(b)}`).classList.remove("error");
        }, 500);

        log("!2You can't breed the same gender!");
        return;
    }

    // Initialize child
    result = new abomination();

    a.children++;
    b.children++;

    // Generate lastname
    let lastName = (a.gender == 1 ? a.name.split(' ').splice(2, 1) : b.name.split(' ').splice(2, 1))
    result.name = `${result.name.split(' ').splice(0, 2).join(' ')} ${lastName}`; 

    // Merges the properties of the parents and applies a mutation
    function combineProperties(a, b, mutation) {
        // Get average
        let result = Math.round((a + b) / 2);

        let added = randInt(0, mutation*2);
        added -= mutation;

        // Apply mutation
        result += added;

        // Make sure result is positive
        if (result < 0) result = 0;

        // Return result
        return result;
    }

    result.generation = Math.max(a.generation, b.generation) + 1;

    // Generate new maxmutation (from the average of parent max mutations plus a mutation of up to 2)
    result.maxmut = combineProperties(a.maxmut, b.maxmut, 2);

    // Generate new properties (from the average of parent properties plus a mutation)
    result.speed = combineProperties(a.speed, b.speed, result.maxmut);
    result.health = combineProperties(a.health, b.health, result.maxmut);
    result.owengayness = combineProperties(a.owengayness, b.owengayness, result.maxmut);
    result.mentalspeed = combineProperties(a.mentalspeed, b.mentalspeed, result.maxmut);
    result.gamer = combineProperties(a.gamer, b.gamer, result.maxmut);
    result.obesity = combineProperties(a.obesity, b.obesity, result.maxmut);
    result.gender = randInt(1, 2);
    result.lifespan = combineProperties(a.lifespan, b.lifespan, result.maxmut);

    result.race = Math.floor(averageHues(a.race, b.race)) + randInt(0, result.maxmut*2) - result.maxmut;

    // Add the new abomination
    abominations.push(result);

    // Display message
    log(`You bred ${a.gender === 1 ? '&0' : '&1'}${a.name}&r and \ ${b.gender === 1 ? '&0' : '&1'} ${b.name}&r!`)

    // Update the interface
    renderAbominations();

    // Make the new abomination glow for a bit
    document.getElementById(`abominations${abominations.length - 1}`).classList.add("new");
    setTimeout(() => {
        document.getElementById(`abominations${abominations.length - 1}`).classList.remove("new");
    }, 500);
}



/**
 * Re-render the abominations.
 */
function renderAbominations() {
    // Get abominations div
    let div = document.getElementById("abominations");

    // Clear div
    div.innerHTML = ""

    // Calculate the current best value for each property
    let best = {
        "speed":        Math.max(...abominations.map(value => (value.isAlive) ? value.speed : -1)),
        "health":       Math.max(...abominations.map(value => (value.isAlive) ? value.health : -1)),
        "owengayness":  Math.min(...abominations.map(value => (value.isAlive) ? value.owengayness : 200)),
        "mentalspeed":  Math.max(...abominations.map(value => (value.isAlive) ? value.mentalspeed : -1)),
        "gamer":        Math.max(...abominations.map(value => (value.isAlive) ? value.gamer : -1)),
        "obesity":      Math.min(...abominations.map(value => (value.isAlive) ? value.obesity : 200)),
        "radiation":    Math.max(...abominations.map(value => (value.isAlive) ? value.maxmut : -1))
    }

    // Add abominations to div
    for (let i = 0; i < abominations.length; i++) {
        let current = abominations[i];
        div.innerHTML +=
            `<div id="abominations${i}" class="abomination ${selected.includes(current) ? "selected" : ""} ${current.isAlive ? "" : "dead"} " onclick="selectAbomination(${i})" width="200px">` + 
                `<div class="header"><p class="small">#${i+1} | Generation ${current.generation} | ${current.children} ${current.children == 1 ? 'child' : 'children'}</p><p class="name"><b>${current.gender === 1 ? '(M)' : '(F)'}</b> ${current.name.split(' ').splice(0,2).join(" ")} <b>${current.name.split(' ')[2]}</b></p></div>` +
                (current.isAlive ? `<img src="${ (current.gender === 1 ? "images/tophat.png" : "images/flower.png")}" style="position: absolute; z-index:20"></img>` : '') +
                `<img src="${current.isAlive ? "images/sealc.png" : "images/sealdead.png"}" style="filter: hue-rotate(${current.race}deg);"></img>` +
                `<p class="stat ${(current.isAlive && current.speed       == best.speed) ?       'best' : ''}" style="background-color:hsl(${current.speed}, 100%, 90%);">` +
                    `<b>Speed: </b>${current.speed}<span class="tooltip">The abomination's speed</span></p>` +
                `<p class="stat ${(current.isAlive && current.health      == best.health) ?      'best' : ''}" style="background-color:hsl(${current.health}, 100%, 90%)">` +
                    `<b>Health: </b>${current.health}<span class="tooltip">The abomination's health</span></p>` +
                `<p class="stat ${(current.isAlive && current.mentalspeed == best.mentalspeed) ? 'best' : ''}" style="background-color:hsl(${current.mentalspeed}, 100%, 90%)">` +
                    `<b>Mental Speed: </b>${current.mentalspeed}<span class="tooltip">The abomination's intelligence</span></p>` +
                `<p class="stat ${(current.isAlive && current.owengayness == best.owengayness) ? 'best' : ''}" style="background-color:hsl(${100-current.owengayness}, 100%, 90%)">` +
                    `<b>Owen Gayness: </b>${current.owengayness}<span class="tooltip">Owen Gayness</span></p>` +
                `<p class="stat ${(current.isAlive && current.obesity     == best.obesity) ?     'best' : ''}" style="background-color:hsl(${100-current.obesity}, 100%, 90%)">` +
                    `<b>Obesity: </b>${current.obesity}<span class="tooltip">The abomination's weight</span></p>` +
                `<p class="stat ${(current.isAlive && current.maxmut      == best.radiation) ?      'best' : ''}" style="background-color:hsl(100, 100%, ${100-(current.maxmut/100)*40}%)">` +
                    `<b>Radiation: </b>${current.maxmut}<span class="tooltip">The amount of change that a child can have from its parent</span></p>` +
                `<button class="killSeal" onclick="abominations.splice(${i}, 1); renderAbominations(); event.stopPropagation();">Remove</button>` +
            `</div>`;
    }
    div.innerHTML += `<img src="images/plus.png" class="addNew" onclick="abominations.push(new abomination()); renderAbominations()">`;
}



/**
 * Reset game.
 */
function reset() {
    // Create abominations
    abominations = [
        new abomination(gender = 1),
        new abomination(gender = 1),
        new abomination(gender = 2),
        new abomination(gender = 2),
    ]

    // Make sure there are males AND females
    abominations[0].gender = 1;
    abominations[1].gender = 2;
    abominations[2].gender = 1;
    abominations[3].gender = 2;

    // Render abominations
    renderAbominations();
}



/**
 * Removes dead abominations from the abominations list.
 */
function clearDead() {
    // Remove dead abominations
    abominations = abominations.filter(function(value) {
        return value.isAlive;
    });

    // Update UI
    renderAbominations();
}
