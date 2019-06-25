// 'Look on my works, ye might, and despair!'
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
var animationSpeed = 1;
function animateNumber(variable, id, num) {
	displayedValue = oldValues[num];
	var actualValue = window[variable]; 
	document.getElementById(id).innerHTML = formatNumber(Math.floor(displayedValue += (actualValue - displayedValue) * animationSpeed + 0.00001));
	oldValues[num] = displayedValue += (actualValue - displayedValue) * animationSpeed;
}

function nav(section) { //Hides every section, then displayed the one we want
	hide('upgradeSection');
	hide('productionSection');
	hide('inventorySection');
	hide('beltSection');

	display(section);
}

function changeColor(button, custom) {
	elem = byId(button);
	if(custom == 'red') {
		elem.className = 'redButton';
	}
	else if(elem.className == 'redButton' || elem.className == 'defaultButton' || custom == 'green') {
		elem.className = 'greenButton';
	}else {
		elem.className = 'redButton';
	}
}

/*=====================================================================================
									 Game code
=======================================================================================*/

// Declaring resource variables
var money = 0;
// Common metals
var iron = 0; var iron_chance = 0.4; var iron_price = 1; var iron_auto = false; var iron_autoPick = false;
var copper = 0; var copper_chance = 0.4; var copper_price = 1; var copper_auto = false; var copper_autoPick = false;
var lead = 0; var lead_chance = 0.2; var lead_price = 2; var lead_auto = false; var lead_autoPick = false;
var tin = 0; var tin_chance = 0.2; var tin_price = 2; var tin_auto = false; var tin_autoPick = false;
var titanium = 0; var titanium_chance = 0.2; titanium_price = 2; var titanium_auto = false; var titanium_autoPick = false;
var silver = 0;	var silver_chance = 0.1; var silver_price = 20; var silver_auto = false; var silver_autoPick = false;

// Valuables
var gold = 0; var gold_chance = 0.05; var gold_price = 50; var gold_auto = false; var gold_autoPick = false;
var diamond = 0; var diamond_chance = 0.01; var diamond_price = 100; var diamond_auto = false; var diamond_autoPick = false;
var ruby = 0; var ruby_chance = 0.01; var ruby_price = 200; var ruby_auto = false; var ruby_autoPick = false;
var jade = 0; var jade_chance = 0.008; var jade_price = 400; var jade_auto = false; var jade_autoPick = false;
var uranium = 0; var uranium_chance = 0.005; var uranium_price = 1000; var uranium_auto = false; var uranium_autoPick = false;

// Startup functions
// Creating inventory boxes
createInventory('Iron', 'iron1', 'iron', 0);
createInventory('Copper', 'copper1', 'copper', 1);
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
createUpgrade('Bigger Ores', 'arrow', 1);
createUpgrade('New Ores', 'lead1', 2);
createUpgrade('Auto pick-up', 'iron1', 3);

var upgradePrices = [10, 50, 100, 200];

// Game loops
setInterval(function() {
	if (!document.hidden) {
		moveOre();
	}
}, 10); // Runs 100 times every second

setInterval(function() {
	updateValues();
}, 100); // Runs 10 times every second

setInterval(function() {
	if (document.hidden) {
		moveOre(true);
	}
	//localStorage.clear();
	save();
}, 1000);

var oreArray = ['iron', 'copper'];
var allOres = ['iron', 'copper', 'lead', 'tin', 'titanium', 'silver', 'gold', 'diamond', 'ruby', 'jade', 'uranium'];
var iterations = 0;
var oreTime = 1050; // How long it takes between each ore spawning
var oreSize = 1; // How much ore you get from each... ore
var ores = [];

var ironImg = 1; var copperImg = 1; var leadImg = 1; var tinImg = 1; var titaniumImg = 1; var silverImg = 1; var goldImg = 1; var diamondImg = 1; var rubyImg = 1; var jadeImg = 1; var uraniumImg = 1; // The amount of image variants each ore has

function selectRandom() { // Select a random ore based on its spawn chance
	for(var i = 0; i <= 100; i++) { // Loops until an ore has been picked
		var randomOre = oreArray[Math.floor(Math.random() * (oreArray.length + 1))]; // Pick a random ore, all chances are equal
		if(Math.random() <= window[randomOre + '_chance']) { // Put the ore up against its chance
			 return { // Creates an object with information about the ore
        		ore: randomOre,
        		imgAmount: window[randomOre + 'Img']
    		}
		}
	}
}

var speed = [];
var whichOre = [];
createOre(); // Calls the function upon load
async function createOre() { 
	var ore = selectRandom();

	if(window[ore.ore + '_autoPick']) {
		if(window[ore.ore + '_auto']) {
			money += window[ore.ore + '_price'] * oreSize; 
		} else {
			window[ore.ore] += oreSize;
		}
	}

	var el = document.createElement( 'div' );
	el.innerHTML = '<div><img draggable="false" class="ore" onclick="pickUp(' + iterations + ')" id="' + iterations + '" src="images/' + ore.ore + Math.ceil(Math.random() * ore.imgAmount) + '.png"/></div>';
	byId("oreAnchor").appendChild(el);

	whichOre.splice(iterations, 0, ore.ore);
	speed.splice(iterations, 0, (Math.random() * 0.41) + 0.1);

	if(window.innerWidth <= 400) {
		byId(iterations).style.right = Math.floor(Math.random() * 66) + 10 + '%'; // A random value between 10 and 75
	} else if(window.innerWidth >= 961) {
		byId(iterations).style.right = Math.floor(Math.random() * 13) + 28 + '%'; // A random value between 35 and 55
	}
	ores[iterations] = iterations;
	iterations++;
	oresOnScreen++;

	await sleep(oreTime); // Function calls itself after a certain wait time
	orePos.splice(orePos.length+1, 0, -10); // Adds a new index to the orePos array
	createOre();
}

function pickUp(num) {
	var elem = document.getElementById(num);
   	elem.parentNode.removeChild(elem);
   	oresOnScreen--;
	removedOres.splice(num, 0, 1);

	if(window[whichOre[num] + '_auto'] && !window[whichOre[num] + '_autoPick']) {
		money += window[whichOre[num] + '_price'] * oreSize; 
	}
	else if(!window[whichOre[num] + '_autoPick']) {
		window[whichOre[num]] += oreSize;
	}

}

var oresOnScreen = 0;
var removedOres = [];
var orePos = [-10];
var oreRemoved = -100;
function moveOre(hidden) {
	for(var i = 0 - oresOnScreen; i < ores.length; i++) { // Loops through all existing ores and moves them
		if(removedOres[i] != 1 && byId(i) != null) {
			if(byId(i).offsetTop > window.innerHeight-70) {
	    		var elem = document.getElementById(i);
   				elem.parentNode.removeChild(elem);
	    		oreRemoved++;
	    		oresOnScreen--;
	    	}
	    }
	    if(byId(i) != null) { // Checking if the element still exists
			byId(i).style.top = orePos[i] + '%' // Finds the ore and changes its top value, moving it downwards
			if(hidden) {
				orePos[i] += speed[i] * 100;
			} else {
				orePos[i] += speed[i]; //0.19
			}
		}
	}
}

function sell(product, produced) {
	product = oreArray[product];
	if(produced && product != undefined) {
		product = product + 'Product';
	}
	if(product != undefined) {
		money += window[product + '_price'] * window[product];
		window[product] = 0;
		updateValues();
	}
}

function createInventory (name, image, id, shopId) {
	var auto = id + '_auto'

	var el = document.createElement( 'div' );
	el.innerHTML = '<div class="inventoryBox">' + name + '<img class="inventoryIcon" src="images/' + image + '.png"/><br /><span id="' + id + 'Amount"></span><br /><span id="' + shopId + 'InventoryPrice"></span><button class="defaultButton" onclick="sell(' + shopId + ')">SELL</button><button class="defaultButton" id="autoSell' + id + '">AUTO SELL</button></div>';

	byId("inventoryAnchor").appendChild(el);
}

// Using parseHTML to create onclick functions with paramters was simply not working
byId('autoSelliron').addEventListener('click', function(){boolean('iron_auto'); changeColor('autoSelliron')});
byId('autoSellcopper').addEventListener('click', function(){boolean('copper_auto'); changeColor('autoSellcopper')});
byId('autoSelllead').addEventListener('click', function(){boolean('lead_auto'); changeColor('autoSelllead')});
byId('autoSelltin').addEventListener('click', function(){boolean('tin_auto'); changeColor('autoSelltin')});
byId('autoSelltitanium').addEventListener('click', function(){boolean('titanium_auto'); changeColor('autoSelltitanium')});
byId('autoSellsilver').addEventListener('click', function(){boolean('silver_auto'); changeColor('autoSellsilver')});
byId('autoSellgold').addEventListener('click', function(){boolean('gold_auto'); changeColor('autoSellgold')});
byId('autoSelldiamond').addEventListener('click', function(){boolean('diamond_auto'); changeColor('autoSelldiamond')});
byId('autoSellruby').addEventListener('click', function(){boolean('ruby_auto'); changeColor('autoSellruby')});
byId('autoSelljade').addEventListener('click', function(){boolean('jade_auto'); changeColor('autoSelljade')});
byId('autoSelluranium').addEventListener('click', function(){boolean('uranium_auto'); changeColor('autoSelluranium')});


function createUpgrade (name, image, id) {
	var auto = id + '_auto'
	var el = document.createElement( 'div' );
	el.innerHTML = '<div class="inventoryBox">' + name + '<img class="inventoryIcon" id="' + id + 'Image" src="images/' + image + '.png"/><br /><span id="' + id + 'Price"></span><br /><span id="' + id + 'Effect"></span><button class="defaultButton" onclick="upgrade(' + id + ')">PURCHASE</button></div>';

	byId("upgradeAnchor").appendChild(el);
}


createProduction('Iron Ingot', 'ironProduct', 0);
createProduction('Copper Ingot', 'copperProduct', 1);
createProduction('Lead Ingot', 'leadProduct', 2);
createProduction('Tin Ingot', 'tinProduct', 3);
createProduction('Titanium Ingot', 'titaniumProduct', 4);
createProduction('Silver Ingot', 'silverProduct', 5);
createProduction('Gold Ingot', 'goldProduct', 6);
createProduction('Diamond Jewlery', 'diamondProduct', 7);
createProduction('Ruby Jewlery', 'rubyProduct', 8);
createProduction('Jade Jewlery', 'jadeProduct', 9);
createProduction('Uranium Pellets', 'uraniumProduct', 10);
function createProduction (name, image, id) {
	var el = document.createElement( 'div' );
	el.innerHTML = '<div class="inventoryBox">' + name + '<img class="inventoryIcon" id="' + id + 'Image" src="images/' + image + '.png"/><br /><span id="' + id + 'ProductAmount"></span><br /><span id="' + id + 'ProductPrice"></span><br /><span id="' + id + 'ProductEffect"></span><div class="barContainer"><section id="' + image + 'Bar"></section></div><button class="defaultButton" style="margin-top:13%;" id="autoSell' + image + '">PRODUCE</button><button class="defaultButton" onclick="sell(' + id + ', true)">SELL</button></div>';

	byId("productionAnchor").appendChild(el);
}

byId('autoSellironProduct').addEventListener('click', function(){boolean('ironProduct_produce'); changeColor('autoSellironProduct')});
byId('autoSellcopperProduct').addEventListener('click', function(){boolean('copperProduct_produce'); changeColor('autoSellcopperProduct')});
byId('autoSellleadProduct').addEventListener('click', function(){boolean('leadProduct_produce'); changeColor('autoSellleadProduct')});
byId('autoSelltinProduct').addEventListener('click', function(){boolean('tinProduct_produce'); changeColor('autoSelltinProduct')});
byId('autoSelltitaniumProduct').addEventListener('click', function(){boolean('titaniumProduct_produce'); changeColor('autoSelltitaniumProduct')});
byId('autoSellsilverProduct').addEventListener('click', function(){boolean('silverProduct_produce'); changeColor('autoSellsilverProduct')});
byId('autoSellgoldProduct').addEventListener('click', function(){boolean('goldProduct_produce'); changeColor('autoSellgoldProduct')});
byId('autoSelldiamondProduct').addEventListener('click', function(){boolean('diamondProduct_produce'); changeColor('autoSelldiamondProduct')});
byId('autoSellrubyProduct').addEventListener('click', function(){boolean('rubyProduct_produce'); changeColor('autoSellrubyProduct')});
byId('autoSelljadeProduct').addEventListener('click', function(){boolean('jadeProduct_produce'); changeColor('autoSelljadeProduct')});
byId('autoSelluraniumProduct').addEventListener('click', function(){boolean('uraniumProduct_produce'); changeColor('autoSelluraniumProduct')});

setInterval(function() {
	produce('ironProduct', 'iron');
	produce('copperProduct', 'copper');
	produce('leadProduct', 'lead');
	produce('tinProduct', 'tin');
	produce('titaniumProduct', 'titanium');
	produce('silverProduct', 'silver');
	produce('goldProduct', 'gold');
	produce('diamondProduct', 'diamond');
	produce('rubyProduct', 'ruby');
	produce('jadeProduct', 'jade');
	produce('uraniumProduct', 'uranium');
}, 10); // Runs 10 times every second

var ironProduct = 0; var ironProduct_produce = false; var ironProduct_time = 0;
var ironProduct_increment = 20; var ironProduct_produceAmt = 10; var ironProduct_price = 15;

var copperProduct = 0; var copperProduct_produce = false; var copperProduct_time = 0;
var copperProduct_increment = 20; var copperProduct_produceAmt = 10; var copperProduct_price = 16;

var leadProduct = 0; var leadProduct_produce = false; var leadProduct_time = 0;
var leadProduct_increment = 10; var leadProduct_produceAmt = 20; var leadProduct_price = 40;

var tinProduct = 0; var tinProduct_produce = false; var tinProduct_time = 0;
var tinProduct_increment = 5; var tinProduct_produceAmt = 20; var tinProduct_price = 45;

var titaniumProduct = 0; var titaniumProduct_produce = false; var titaniumProduct_time = 0;
var titaniumProduct_increment = 5; var titaniumProduct_produceAmt = 20; var titaniumProduct_price = 45;

var silverProduct = 0; var silverProduct_produce = false; var silverProduct_time = 0;
var silverProduct_increment = 2.5; var silverProduct_produceAmt = 20; var silverProduct_price = 800;

var goldProduct = 0; var goldProduct_produce = false; var goldProduct_time = 0;
var goldProduct_increment = 2.5; var goldProduct_produceAmt = 1; var goldProduct_price = 1000;

var diamondProduct = 0; var diamondProduct_produce = false; var diamondProduct_time = 0;
var diamondProduct_increment = 1; var diamondProduct_produceAmt = 10; var diamondProduct_price = 1000;

var rubyProduct = 0; var rubyProduct_produce = false; var rubyProduct_time = 0;
var rubyProduct_increment = 1; var rubyProduct_produceAmt = 3; var rubyProduct_price = 3200;

var jadeProduct = 0; var jadeProduct_produce = false; var jadeProduct_time = 0;
var jadeProduct_increment = 1; var jadeProduct_produceAmt = 2; var jadeProduct_price = 2000;

var uraniumProduct = 0; var uraniumProduct_produce = false; var uraniumProduct_time = 0;
var uraniumProduct_increment = 1; var uraniumProduct_produceAmt = 10; var uraniumProduct_price = 25000;

function produce(product, ore) {
	if(window[product + '_produce']) {
		if(window[ore] >= window[product + '_produceAmt']) {
			window[product + '_time'] += window[product + '_increment'] / 100;

			var bar = document.getElementById(product + 'Bar').style;
			bar.width = window[product + '_time'] + '%';

			if(window[product + '_time'] >= 100) {
				window[product]++;
				window[product + '_time'] = 0;
				bar.width = window[product + '_time'] + '%';
				window[ore] -= window[product + '_produceAmt'];
			}
		}
	}
}

var speedUpgrades = 0;
var oreUpgradeStage = [];
var autoUpgradeStage = [];
function upgrade(id, load) {
	if(money >= upgradePrices[id] || load) {
		switch(id){
			case 0:
				if(speedUpgrades < 100) {
					money -= upgradePrices[id];
					oreTime -= 10;
					upgradePrices[id] *= 1.1;
					speedUpgrades++;
				}
				break;
			case 1:
				money -= upgradePrices[id];
				oreSize++;
				upgradePrices[id] *= 1.2;
				break;

			case 2:
				if(oreUpgradeStage.length < 9 || load) {
					if(!load) {
						money -= upgradePrices[id];
					}
					var length = oreUpgradeStage.length;
					if(load) {
						length--;
					}
					if(length == 0) {
						byId('2Image').src = 'images/tin1.png';
						byId('2Effect').innerHTML = 'Tin';
						if(!load) {
							oreArray.splice(oreArray.length, 0, 'lead');
							upgradePrices[id] += 200;
						}

					} else if(length == 1) {
						byId('2Image').src = 'images/titanium1.png';
						byId('2Effect').innerHTML = 'Titanium';
						if(!load) {
							oreArray.splice(oreArray.length, 0, 'tin');
							upgradePrices[id] += 200;
						}

					} else if(length == 2) {
						byId('2Image').src = 'images/silver1.png';
						byId('2Effect').innerHTML = 'Silver';
						if(!load) {
							oreArray.splice(oreArray.length, 0, 'titanium');
							upgradePrices[id] += 200;
						}

					} else if(length == 3) {
						byId('2Image').src = 'images/gold1.png';
						byId('2Effect').innerHTML = 'Gold';
						if(!load) {
							oreArray.splice(oreArray.length, 0, 'silver');
							upgradePrices[id] += 200;
						}

					} else if(length == 4) {
						byId('2Image').src = 'images/diamond1.png'
						byId('2Effect').innerHTML = 'Diamond';
						if(!load) {
							oreArray.splice(oreArray.length, 0, 'gold');
							upgradePrices[id] += 200;
						}

					} else if(length == 5) {
						byId('2Image').src = 'images/ruby1.png'; // Placeholder
						byId('2Effect').innerHTML = 'Ruby';
						if(!load) {
							oreArray.splice(oreArray.length, 0, 'diamond');
							upgradePrices[id] += 200;
						}

					} else if(length == 6) {
						byId('2Image').src = 'images/jade1.png'; // Placeholder
						byId('2Effect').innerHTML = 'Jade';
						if(!load) {
							oreArray.splice(oreArray.length, 0, 'ruby');
							upgradePrices[id] += 200;
						}

					} else if(length == 7) {
						byId('2Image').src = 'images/uranium1.png';
						byId('2Effect').innerHTML = 'Uranium';
						if(!load) {
							oreArray.splice(oreArray.length, 0, 'jade');
							upgradePrices[id] += 200;
						}

					} else if(length == 8) {
						byId('2Image').src = 'images/checkmark.png';
						byId('2Effect').innerHTML = 'All unlocked!';
						if(!load) {
							oreArray.splice(oreArray.length, 0, 'uranium');
							upgradePrices[id] += 200;
						}

					}
					if(!load && length < 9) {
						oreUpgradeStage[oreUpgradeStage.length] = 1;
					}
				}
				break;
			case 3:
				if(autoUpgradeStage.length < 11 || load) {
					if(!load) {
						money -= upgradePrices[id];
					}
					var length = autoUpgradeStage.length;
					if(load) {
						length--;
					}
					if(length == 0) {
						byId('3Image').src = 'images/copper1.png';
						byId('3Effect').innerHTML = 'Copper';
						if(!load) {
							iron_autoPick = true;
							upgradePrices[id] += 200;
						}

					} else if(length == 1) {
						byId('3Image').src = 'images/tin1.png';
						byId('3Effect').innerHTML = 'Tin';
						if(!load) {
							copper_autoPick = true;
							upgradePrices[id] += 200;
						}

					} else if(length == 2) {
						byId('3Image').src = 'images/lead1.png';
						byId('3Effect').innerHTML = 'Lead';
						if(!load) {
							lead_autoPick = true;
							upgradePrices[id] += 200;
						}

					} else if(length == 3) {
						byId('3Image').src = 'images/titanium1.png';
						byId('3Effect').innerHTML = 'Titanium';
						if(!load) {
							tin_autoPick = true;
							upgradePrices[id] += 200;
						}

					} else if(length == 4) {
						byId('3Image').src = 'images/silver1.png';
						byId('3Effect').innerHTML = 'Silver';
						if(!load) {
							titanium_autoPick = true;
							upgradePrices[id] += 200;
						}

					} else if(length == 5) {
						byId('3Image').src = 'images/gold1.png';
						byId('3Effect').innerHTML = 'Gold';
						if(!load) {
							silver_autoPick = true;
							upgradePrices[id] += 200;
						}

					} else if(length == 6) {
						byId('3Image').src = 'images/diamond1.png';
						byId('3Effect').innerHTML = 'Diamond';
						if(!load) {
							gold_autoPick = true;
							upgradePrices[id] += 200;
						}

					} else if(length == 7) {
						byId('3Image').src = 'images/ruby1.png';
						byId('3Effect').innerHTML = 'Ruby';
						if(!load) {
							diamond_autoPick = true;
							upgradePrices[id] += 200;
						}

					} else if(length == 8) {
						byId('3Image').src = 'images/jade1.png';
						byId('3Effect').innerHTML = 'Jade';
						if(!load) {
							ruby_autoPick = true;
							upgradePrices[id] += 200;
						}

					} else if(length == 9) {
						byId('3Image').src = 'images/uranium1.png';
						byId('3Effect').innerHTML = 'Uranium';
						if(!load) {
							jade_autoPick = true;
							upgradePrices[id] += 200;
						}
					} else if(length == 10) {
						byId('3Image').src = 'images/checkmark.png';
						byId('3Effect').innerHTML = 'All unlocked!';
						if(!load) {
							uranium_autoPick = true;
							upgradePrices[id] += 200;
						}
					}
					if(!load) {
						autoUpgradeStage[autoUpgradeStage.length] = 1;
					}
				}
				break;
		}
	}
}

byId('2Effect').innerHTML = 'Lead';
byId('3Effect').innerHTML = 'Iron';

function updateValues() { // Updates values displayed on screen

	//Upgrade prices
	byId('0Price').innerHTML = '$' + Math.ceil(upgradePrices[0]);
	byId('1Price').innerHTML = '$' + Math.ceil(upgradePrices[1]);
	byId('2Price').innerHTML = '$' + Math.ceil(upgradePrices[2]);
	byId('3Price').innerHTML = '$' + Math.ceil(upgradePrices[3]);

	for(var i = 0; i < allOres.length; i++) {
		byId(i + 'ProductAmount').innerHTML = window[allOres[i]] + '/' + window[allOres[i] + 'Product_produceAmt'] + ' ' + allOres[i];
		byId(i + 'ProductPrice').innerHTML = 'Worth: $' + window[allOres[i] + 'Product_price'];
		byId(i + 'ProductEffect').innerHTML = 'Produced: ' + window[allOres[i] + 'Product'];
	}

	//Upgrade effects
	byId('0Effect').innerHTML = (1000 - (oreTime - 50))/10 + '% faster';
	byId('1Effect').innerHTML = 'Ore size: ' + oreSize;

	for(var i = 0; i <= 10; i++) {
		byId(i + 'InventoryPrice').innerHTML = 'Worth $' + window[allOres[i] + '_price'];
	}

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


var storage = window.localStorage
function loadUp() {
 	if(localStorage.length != 0) {
 		oreUpgradeStage = JSON.parse(storage.getItem("oreUpgradeStage"));
 		autoUpgradeStage = JSON.parse(storage.getItem("autoUpgradeStage"));
 		for(var i = 0; i < allOres.length; i++) {
			window[allOres[i]] = Number(storage.getItem(allOres[i]));
			window[allOres[i] + '_auto'] = JSON.parse(storage.getItem(allOres[i] + '_auto'));
			window[allOres[i] + '_autoPick'] = JSON.parse(storage.getItem(allOres[i] + '_autoPick'));

			window[allOres[i] + 'Product'] = Number(storage.getItem(allOres[i] + 'Product'));
			window[allOres[i] + 'Product_produce'] = JSON.parse(storage.getItem(allOres[i] + 'Product_produce'));


			if(window[allOres[i] + '_auto']) {
				changeColor('autoSell' + allOres[i], 'green');
			} else  {
				changeColor('autoSell' + allOres[i], 'red');
			}

			if(window[allOres[i] + 'Product_produce']) {
				changeColor('autoSell' + allOres[i] + 'Product', 'green');
			} else  {
				changeColor('autoSell' + allOres[i] + 'Product', 'red');
			}

		}
		for(var i = 0; i < oreUpgradeStage.length; i++) {
			upgrade(2, true);
		}
		autoUpgradeStage.length
		for(var i = 0; i < autoUpgradeStage.length; i++) {
			upgrade(3, true);
		}
		money = Number(storage.money);
		speedUpgrades = Number(storage.speedUpgrades);
		oreTime = Number(storage.oreTime);
		oreSize = Number(storage.oreSize);
		oreArray = JSON.parse(storage.getItem("oreArray"));
		upgradePrices = JSON.parse(storage.getItem("upgradePrices"));

 	} else {
 	}
 }

 // Updates localStorage values
function save() {
	for(var i = 0; i < allOres.length; i++) {
		storage.setItem(allOres[i], window[allOres[i]]);
		storage.setItem(allOres[i] + '_auto', JSON.stringify(window[allOres[i] + '_auto']));
		storage.setItem(allOres[i] + '_autoPick', JSON.stringify(window[allOres[i] + '_autoPick']));

		storage.setItem(allOres[i] + 'Product', window[allOres[i] + 'Product']);
		storage.setItem(allOres[i] + 'Product_produce', JSON.stringify(window[allOres[i] + 'Product_produce']));
	}
 	storage.money = money;
 	storage.speedUpgrades = speedUpgrades;
 	storage.oreTime = oreTime;
 	storage.oreSize = oreSize;
	storage.autoUpgradeStage = JSON.stringify(autoUpgradeStage);
	storage.oreUpgradeStage = JSON.stringify(oreUpgradeStage);
	storage.oreArray = JSON.stringify(oreArray);
	storage.upgradePrices = JSON.stringify(upgradePrices);
}

loadUp();