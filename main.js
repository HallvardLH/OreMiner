// https://kvsr.itch.io/stone - stones source
// https://raventale.itch.io/daily-doodles-asset-pack-2 - diamonds source

// Unused art
// https://raventale.itch.io/daily-doodles-variations
// https://raventale.itch.io/daily-doodles-pixelart-asset-pack
// https://finalbossblues.itch.io/dark-dimension-tileset
// https://gentlecatstudio.itch.io/rpg-items
// https://kronbits.itch.io/matriax-free-assets
// https://kyrise.itch.io/kyrises-free-16x16-rpg-icon-pack

/*=====================================================================================
									 Helper functions
=======================================================================================*/
function hide(id) {
    document.getElementById(id).style.display = "none";
}

function display(id) {
    document.getElementById(id).style.display = "block";
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var byId = function(id) {
	return document.getElementById(id);
}

/*=====================================================================================
									 Game code
=======================================================================================*/

// Declaring resource variables
// Common metals
var iron = 0;
var copper = 0;
var lead = 0;
var tin = 0;
var titanium = 0;
var silver = 0;

// Valuables
var gold = 0;
var diamond = 0;
var ruby = 0;
var jade = 0;
var uranium = 0;

//Startup functions
createBox('Iron', 'iron2', 'iron');
createBox('Copper', 'copper4', 'copper');
createBox('Diamonds', 'diamond1', 'diamond');

// Game loops
setInterval(function() {
	moveOre();
}, 10); // Runs 100 times every second

setInterval(function() {
	//createOre();
}, 1000);

var oreArray = ['iron', 'copper', 'diamond']; //['iron', 'copper', 'lead', 'tin', 'titanium', 'silver', 'gold', 'diamond', 'ruby', 'jade', 'uranium']
// Chances of spawning in percent
var iron_chance = 0.4;
var copper_chance = 0.4;
var diamond_chance = 0.01;

var iterations = 0;
var oreTime = 1000; // How long it takes between each ore spawning
var ores = [];

var ironImg = 8; var copperImg = 8; var diamondImg = 1; // The amount of image variants each ore has

function selectRandom() { // Select a random ore based on its spawn chance
	for(var i = 0; i <= 100; i++) {
		var randomOre = oreArray[Math.floor(Math.random() * oreArray.length)]; // Pick a random ore, all chances are equal
		if(Math.random() <= window[randomOre + '_chance']) { // Put the ore up against its chance
			 return { // Creates an object with information about the ore
        		ore: randomOre,
        		imgAmount: window[randomOre + 'Img']
    		}
		}
	}
}

createOre(); // Calls the function upon load
async function createOre() { 
	var ore = selectRandom();

	window[ore.ore]++;
	updateValues();

	str = $.parseHTML('<img class="ore" onclick="hide(this.id)" id="' + iterations + '" src="images/' + ore.ore + Math.ceil(Math.random() * ore.imgAmount) + '.png"/>'),

	$("#oreAnchor").append(str);

	document.getElementById(iterations).style.right = Math.floor(Math.random() * 66) + 10 + '%'; // A random value between 10 and 75
	ores[iterations] = iterations;
	iterations++;

	await sleep(oreTime); // Function calls itself after a certain wait time
	orePos.splice(orePos.length+1, 0, -10); // Adds a new index to the orePos array
	createOre();
}

var orePos = [-10];
var oreRemoved = 0;
function moveOre() {
	for(var i = 0 + oreRemoved; i < ores.length; i++) { // Loops through all existing ores and moves them
		document.getElementById(i).style.top = orePos[i] + '%' // Finds the ore and changes its top value, moving it downwards
		orePos[i] += 0.19//0.115;
		if(orePos[i] > 200) {
		    var elem = document.getElementById(i);
    		elem.parentNode.removeChild(elem);
    		oreRemoved++;
    	}
	}
}

function sell(product) {
	window[product + 'Price']
}

function createBox (name, image, id) {
	str = $.parseHTML('<div class="inventoryBox">' + name + '<img class="inventoryIcon" src="images/' + image + '.png"/><br /><span id="' + id + 'Amount"></span><br /><span id="' + id + 'Price"></span><button onclick="">SELL</button></div>')

	$("#inventoryAnchor").append(str);
}

function updateValues() { // Updates values displayed on screen
	byId('ironAmount').innerHTML = iron;
	byId('copperAmount').innerHTML = copper;
	byId('diamondAmount').innerHTML = diamond;
}

function nav(section) { //Hides every section, then displayed the one we want
	hide('upgradeSection');
	hide('inventorySection');
	hide('beltSection');

	display(section);
}