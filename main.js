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

function boolean(variable) {
	window[variable] = !window[variable];
}

var suffixes = [' million', ' billion', ' trillion', ' quadrillion', ' quintillion', ' sextillion', ' septillion', ' octillion', ' nonillion'];
function formatNumber(number, param) {
	if(number < 1000000) {
		if(param == 'money') {
			return '$' + number.toFixed(2);
		}else {
			return number;
		}
	}
	var arrayIndex = -4;
	number++;
	for(var compare = 1; arrayIndex < 20; compare *= 1000){
		arrayIndex++;
		if(compare >= number) {
			compare /= 1000;
			number /= compare
			number = Math.round(number * 100) / 100
			return number + suffixes[arrayIndex];
		}
	}
}


// Thanks to Orteil of Cookie Clicker some helpful input on this one!
var oldValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var animationSpeed = 0.25;
function animateNumber(variable, id, num) {
	displayedValue = oldValues[num];
	var actualValue = window[variable]; 
	document.getElementById(id).innerHTML = formatNumber(Math.floor(displayedValue += (actualValue - displayedValue) * animationSpeed + 0.00001));
	oldValues[num] = displayedValue += (actualValue - displayedValue) * animationSpeed;
}

/*=====================================================================================
									 Game code
=======================================================================================*/

// Declaring resource variables
var money = 0;
// Common metals
var iron = 0; var iron_chance = 0.4; var iron_price = 1; var iron_auto = false;
var copper = 0; var copper_chance = 0.4; var copper_price = 1; var copper_auto = false;
var lead = 0; var lead_chance = 0.2; var lead_price = 2; var lead_auto = false;
var tin = 0; var tin_chance = 0.2; var tin_price = 2; var tin_auto = false;
var titanium = 0; var titanium_chance = 0.2; titanium_price = 2; var titanium_auto = false;
var silver = 0;	var silver_chance = 0.1; var silver_price = 20; var silver_auto = false;

// Valuables
var gold = 0; var gold_chance = 0.05; var gold_price = 50; var gold_auto = false;
var diamond = 0; var diamond_chance = 0.01; var diamond_price = 100; var diamond_auto = false;
var ruby = 0; var ruby_chance = 0.01; var ruby_price = 100; var ruby_auto = false;
var jade = 0; var jade_chance = 0.005; var jade_price = 1000; var jade_auto = false;
var uranium = 0; var uranium_chance = 0.001; var uranium_price = 10000; var uranium_auto = false;

var documentHeight = window.innerHeight;

// Startup functions
// Creating inventory boxes
createInventory('Iron', 'iron2', 'iron', 0);
createInventory('Copper', 'copper4', 'copper', 1);
createInventory('Lead', 'lead1', 'lead', 2);
createInventory('Tin', 'tin1', 'tin', 3);
createInventory('Titanium', 'titanium1', 'titanium', 4);
createInventory('Silver', 'silver1', 'silver', 5);
createInventory('Gold', 'gold1', 'gold', 6);
createInventory('Diamonds', 'diamond1', 'diamond', 7);
createInventory('Rubies', 'ruby1', 'ruby', 8);
createInventory('Jade', 'jade1', 'jade', 9);
createInventory('Uranium', 'uranium1', 'uranium', 10);

// Creating upgrade boxes
createUpgrade('Faster Mining', 'pickaxe', 0);
createUpgrade('Bigger Ores', 'iron1', 1);
createUpgrade('New Ores', 'lead1', 2);

var upgradePrices = [10, 100, 100];

// Game loops
setInterval(function() {
	moveOre();
}, 10); // Runs 100 times every second

setInterval(function() {
	updateValues();
}, 100); // Runs 10 times every second

setInterval(function() {
	if(window.innerWidth >= 550 || window.innerHeight <= 500){ // Checks if screen is too big for game
		console.log('Too big');
	}
}, 1000);

var oreArray = ['iron', 'copper'];
var iterations = 0;
var oreTime = 1000; // How long it takes between each ore spawning
var oreSize = 1; // How much ore you get from each... ore
var ores = [];

var ironImg = 8; var copperImg = 8; var leadImg = 1; var tinImg = 1; var titaniumImg = 1; var silverImg = 1; var goldImg = 1; var diamondImg = 1; var rubyImg = 1; var jadeImg = 1; var uraniumImg = 1; // The amount of image variants each ore has

function selectRandom() { // Select a random ore based on its spawn chance
	for(var i = 0; i <= 100; i++) { // Loops until an ore has been picked
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

	if(window[ore.ore + '_auto']) {
		money += window[ore.ore + '_price'] * oreSize; 
	} else {
		window[ore.ore] += oreSize;
	}
	updateValues();

	str = $.parseHTML('<img class="ore" id="' + iterations + '" src="images/' + ore.ore + Math.ceil(Math.random() * ore.imgAmount) + '.png"/>'),

	$("#oreAnchor").append(str);

	byId(iterations).style.right = Math.floor(Math.random() * 66) + 10 + '%'; // A random value between 10 and 75
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
		byId(i).style.top = orePos[i] + '%' // Finds the ore and changes its top value, moving it downwards
		orePos[i] += 0.19//0.115;
		if(byId(i).offsetTop > documentHeight-90) {
		    var elem = document.getElementById(i);
    		elem.parentNode.removeChild(elem);
    		oreRemoved++;
    	}
	}
}

function sell(product) {
	product = oreArray[product];
	money += window[product + '_price'] * window[product];
	window[product] = 0;
	updateValues();
}

function createInventory (name, image, id, shopId) {
	var auto = id + '_auto'
	str = $.parseHTML('<div class="inventoryBox">' + name + '<img class="inventoryIcon" src="images/' + image + '.png"/><br /><span id="' + id + 'Amount"></span><br /><span id="' + id + 'Price"></span><button onclick="sell(' + shopId + ')">SELL</button><button id="autoSell' + id + '" onclick="">AUTO SELL</button></div>')

	$("#inventoryAnchor").append(str);
}

// Using parseHTML to create onclick functions with paramteres was simply not working
// So I went with Jquery instead
$("#autoSellIron").click(function() {boolean('iron_auto')});
$("#autoSellCopper").click(function() {boolean('copper_auto')});
$("#autoSellLead").click(function() {boolean('lead_auto')});
$("#autoSellTin").click(function() {boolean('tin_auto')});
$("#autoSellTitanium").click(function() {boolean('titanium_auto')});
$("#autoSellSilver").click(function() {boolean('silver_auto')});
$("#autoSellGold").click(function() {boolean('gold_auto')});
$("#autoSellDiamond").click(function() {boolean('diamond_auto')});
$("#autoSellRuby").click(function() {boolean('ruby_auto')});
$("#autoSellJade").click(function() {boolean('jade_auto')});


function createUpgrade (name, image, id) {
	str = $.parseHTML('<div class="inventoryBox">' + name + '<img class="inventoryIcon" id="' + id + 'Image" src="images/' + image + '.png"/><br /><span id="' + id + 'Price"></span><br /><span id="' + id + 'Effect"></span><button onclick="upgrade(' + id + ')">PURCHASE</button></div>')

	$("#upgradeAnchor").append(str);
}

var oreUpgradeStage = [];
function upgrade(id) {
	if(money >= upgradePrices[id]) {
		switch(id){
			case 0:
				oreTime -= 10;
				break;
			case 1:
				oreSize++;
				break;

			case 2:
				if(oreUpgradeStage.length == 0) {
					oreArray.splice(oreArray.length, 0, 'lead');
					byId('2Image').src = 'images/tin1.png';
					byId('2Effect').innerHTML = 'Tin';

				} else if(oreUpgradeStage.length == 1) {
					oreArray.splice(oreArray.length, 0, 'tin');
					byId('2Image').src = 'images/iron4.png'; // Placeholder
					byId('2Effect').innerHTML = 'Titanium';

				} else if(oreUpgradeStage.length == 2) {
					oreArray.splice(oreArray.length, 0, 'titanium');
					byId('2Image').src = 'images/iron4.png'; // Placeholder
					byId('2Effect').innerHTML = 'Silver';

				} else if(oreUpgradeStage.length == 3) {
					oreArray.splice(oreArray.length, 0, 'silver');
					byId('2Image').src = 'images/iron4.png'; // Placeholder
					byId('2Effect').innerHTML = 'Gold';

				} else if(oreUpgradeStage.length == 4) {
					oreArray.splice(oreArray.length, 0, 'gold');
					byId('2Image').src = 'images/iron4.png'; // Placeholder
					byId('2Effect').innerHTML = 'Diamond';

				} else if(oreUpgradeStage.length == 5) {
					oreArray.splice(oreArray.length, 0, 'diamond');
					byId('2Image').src = 'images/iron4.png'; // Placeholder
					byId('2Effect').innerHTML = 'Ruby';

				} else if(oreUpgradeStage.length == 6) {
					oreArray.splice(oreArray.length, 0, 'ruby');
					byId('2Image').src = 'images/iron4.png'; // Placeholder
					byId('2Effect').innerHTML = 'Jade';

				} else if(oreUpgradeStage.length == 7) {
					oreArray.splice(oreArray.length, 0, 'jade');
					byId('2Image').src = 'images/iron4.png'; // Placeholder
					byId('2Effect').innerHTML = 'Uranium';

				} else if(oreUpgradeStage.length == 8) {
					oreArray.splice(oreArray.length, 0, 'uranium');
					byId('2Image').src = 'images/iron4.png'; // Placeholder
					byId('2Effect').innerHTML = 'All unlocked!';

				}

				oreUpgradeStage[oreUpgradeStage.length] = 1;
				break;
		}

		money -= upgradePrices[id];
		upgradePrices[id] *= 1.1;
		updateValues();
	}
}

function updateValues() { // Updates values displayed on screen

	//Upgrade prices
	byId('0Price').innerHTML = '$' + Math.ceil(upgradePrices[0]);
	byId('1Price').innerHTML = '$' + Math.ceil(upgradePrices[1]);
	byId('2Price').innerHTML = '$' + Math.ceil(upgradePrices[2]);

	//Upgrade effects
	byId('0Effect').innerHTML = (1000 - oreTime)/10 + '% faster';
	byId('1Effect').innerHTML = 'Ore size: ' + oreSize;

	//Money
	//byId('money').innerHTML = '$' + money;

	animateNumber('money', 'money', 0);
    animateNumber('iron', 'ironAmount', 1);
    animateNumber('copper', 'copperAmount', 2);
    animateNumber('lead', 'leadAmount', 3);
    animateNumber('tin', 'tinAmount', 4);
    animateNumber('titanium', 'titaniumAmount', 5);
    animateNumber('silver', 'silverAmount', 6);
    animateNumber('gold', 'goldAmount', 7);
    animateNumber('diamond', 'diamondAmount', 8);
    animateNumber('ruby', 'rubyAmount', 9);
	animateNumber('jade', 'jadeAmount', 10);
	animateNumber('uranium', 'uraniumAmount', 11);
}


function nav(section) { //Hides every section, then displayed the one we want
	hide('upgradeSection');
	hide('productionSection');
	hide('inventorySection');
	hide('beltSection');

	display(section);
}