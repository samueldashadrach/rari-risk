// resource: https://www.youtube.com/watch?v=l2rzT_Dp4T0&ab_channel=EatTheBlocks

const fetch = require('node-fetch');



const period = 68; // 68 blocks of 13.2 seconds is 15 min
const END = 12278500; // Apr-20-2021 05:54:09 PM +UTC
const no_segments = 500;


/*
const period = 340; // 68 blocks of 13.2 seconds is 15 min, 340 is 5 oracle periods
const END = 12278500; // Apr-20-2021 05:54:09 PM +UTC
const no_segments = 500;
*/

const INF = 1000000000000000;

const queryUniswap = async(id, blockno) => {
	str = `
	{
	  pair(
	    id: "${id}"
	  	block: {number: ${blockno}}
	  ){
	  	id
	    token0{
	      symbol
	    }
	    token1{
	      symbol
	    }
	    token0Price
	    token1Price
	    reserve0
	    reserve1
	  }
	    
	}`;

	
	const response = await fetch(
		"https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
		{
			method: "post",
			body: JSON.stringify( {query: str} ),
			headers: { "Content-Type": "application/json" },
			timeout: 50000,
		}
	).then((res) => res.json())

	point = response.data.pair;
	point.blockno = blockno;
	return parse(point);
};


MINLIQ = INF;
MAXSHOCK = 0;
MINSHOCK = 0;


const querymany = async(id, blockend, no_segments) => {

	await new Promise((resolve) => {

	data = [];
	done = 0;
	failed = 0;

	for(blockno = blockend - no_segments * period; blockno < blockend; blockno += period)
		{
			queryUniswap(id,blockno).then(
				value => {
					data.push(value);
					++done;
					console.log(value);

					console.log("done: " + done);
					console.log("failed: " + failed);		
					if(done + failed >= no_segments)
					{
						result = work(data);
						if(result.minliquidity < MINLIQ){
							MINLIQ = result.minliquidity;
						}
						if(result.shocks.min.val < MINSHOCK){
							MINSHOCK = result.shocks.min.val;
						}
						if(result.shocks.max.val > MAXSHOCK){
							MAXSHOCK = result.shocks.max.val;
						}
						console.log("MINLIQ                 MAXSHOCK                  MINSHOCK");						
						console.log(MINLIQ, MAXSHOCK, MINSHOCK);
						resolve(true);
					}
				},
				error => {
					++failed;
					console.log(error);

					console.log("done: " + done);
					console.log("failed: " + failed);
					if(done + failed >= no_segments)
					{
						result = work(data);
						if(result.minliquidity < MINLIQ){
							MINLIQ = result.minliquidity;
						}
						if(result.shocks.min.val < MINSHOCK){
							MINSHOCK = result.shocks.min.val;
						}
						if(result.shocks.max.val > MAXSHOCK){
							MAXSHOCK = result.shocks.max.val;
						}
						console.log("MINLIQ                 MAXSHOCK                  MINSHOCK");
						console.log(MINLIQ, MAXSHOCK, MINSHOCK);
						resolve(true);
					}
				}
			);
		}
	});
}


function parse(point){
	point.reserve0 = parseFloat(point.reserve0);
	point.reserve1 = parseFloat(point.reserve1);
	point.token0Price = parseFloat(point.token0Price);
	point.token1Price = parseFloat(point.token1Price);
	return point;
}

function sleep(milliseconds) {
	console.log("sleeping for " + milliseconds + " ms");
	const date = Date.now();
	let currentDate = null;
	do {
    	currentDate = Date.now();
	} while (currentDate - date < milliseconds);
	console.log("waking up");
}

const main = async() => {
	
	const id =
	//"0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852"; // ETH-USDT
	//"0x0dacb47e00aed6abade32c7b398e029393e0d848"; // SOCKS-ETH
	//"0x73e02eaab68a41ea63bdae9dbd4b7678827b2352"; // INV-ETH
	//"0x3d07f6e1627da96b8836190de64c1aed70e3fc55"; // SGT-ETH
	//"0xfaad1072e259b5ed342d3f16277477b46d379abc"; // DEGEN-ETH
	//"0xdc2b82bc1106c9c5286e59344896fb0ceb932f53"; // RGT-ETH
	//"0xc76225124f3caab07f609b1d147a31de43926cd6"; // SFI-ETH
	//"0xbb2b8038a1640196fbe3e38816f3e67cba72d940"; // WBTC-ETH
	//"0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc"; // USDC-ETH
	//"0xce84867c3c02b05dc570d0135103d3fb9cc19433"; // SUSHI-ETH
	//"0x4d96369002fc5b9687ee924d458a7e5baa5df34e"; // MPH-ETH
	//"0xcd7989894bc033581532d2cd88da5db0a4b12859"; // WBTC-BADGER
	//"0x1ffc57cada109985ad896a69fbcebd565db4290e"; // FTM-ETH
	//"0x1273ad5d8f3596a7a39efdb5a4b8f82e8f003fc3"; // HEGIC-ETH
	//"0x87febfb3ac5791034fd5ef1a615e9d9627c2665d"; // KP3R-ETH
	//"0xa2107fa5b38d9bbd2c461d6edf11b11a50f6b974"; // LINK-ETH
	//"0x2fdbadf3c4d5a8666bc06645b8358ab803996e28"; // YFI-ETH
	//"0xdfc14d2af169b0d36c4eff567ada9b2e0cae044f"; // AAVE-ETH
	//"0x88d97d199b9ed37c29d846d00d443de980832a22"; // UMA-ETH
	//"0x0d0d65e7a7db277d3e0f5e1676325e75f3340455"; // MPH-ETH
	//"0x2e81ec0b8b4022fac83a21b2f2b4b8f5ed744d70"; // ETH-GRT
	//"0x8878df9e1a7c87dcbf6d3999d997f262c05d8c70"; // LRC-ETH
	//"0x26aad2da94c59524ac0d93f6d6cbf9071d7086f2"; // 1INCH-ETH
	//"0xc6f348dd3b91a56d117ec0071c1e9b83c0996de4"; // ETH-ZRX
	//"0xd3d2e2692501a5c9ca623199d38826e513033a17"; // UNI-ETH
	//"0xcffdded873554f362ac02f8fb1f02e5ada10516f"; // COMP-ETH
	//"0xc2adda861f89bbb333c90c492cb837741916a225"; // MKR-ETH
	//"0x43ae24960e5534731fc831386c07755a2dc33d47"; // SNX-ETH
	//"0x3da1313ae46132a397d90d95b1424a9a7e3e0fce"; // ETH-CRV
	//"0x4d5ef58aac27d99935e5b6b4a6778ff292059991"; // DPI-ETH
	//"0x4d3c5db2c68f6859e0cd05d080979f597dd64bff"; // MVI-ETH
	"0x60b2cc2c6ecd3dd89b4fd76818ef83186e2f2931"; // ALPHA-ETH


	
	for(blockend = END; true ; blockend -= no_segments * period)
	{
		console.log("new batch, blockend: " + blockend);
		await querymany(id,blockend,no_segments);
		console.log("batch completed, blockend: " + blockend);
		sleep(10000);
	}
}

function biggerblockno(a,b)
{
	if(a.blockno > b.blockno)
		return 1;
	else  if(a.blockno < b.blockno)
		return -1;
	else
		return 0;
}

function work(data){
	data.sort(biggerblockno);
	//console.log(data);

	var result = {
		minliquidity: INF,
		shocks: 0,
	};
	result.minliquidity = minliq(data);
	console.log("Min liquidity: " + result.minliquidity);

	result.shocks = maxminshock(data);
	console.log("shocks: " + JSON.stringify(result.shocks));

	return result;
}


function minliq(data){
	min = INF;
	for(i=0; i < data.length; i++)
	{
		try {
			if(data[i].reserve0 < min)
				min = data[i].reserve0;
		}
		catch (err) {
			console.log(data[i]);
		}
	}
	return min;
}

function maxminshock(data) {

	var shocks = {
		max: {
			val: 0,
			i: -1,
		},
		min: {
			val: 0,
			i: -1,
		},
	};

	console.log(data);

	for ( i = 1; i < data.length; ++i) {
		shock = (data[i].token0Price - data[i-1].token0Price)/data[i].token0Price;
		if ( shock > shocks.max.val){
			shocks.max.val = shock;
			shocks.max.i = i;
		}
		else if ( shock < shocks.min.val) {
			shocks.min.val = shock;
			shocks.min.i = i;
		}
	}

	return shocks;
}

/*function maxminshock(data, period){ // hope this code is correct :/

	var shocks = 
	{
		max: {
			val: 0,
			i: -1,
			front: -1,
			back: -1,
		},

		min: {
			val: 0,
			i: -1,
			front: -1,
			back: -1,
		}
	};

	active = 0; // number of datapoints without error in the current period
	sum = 0;

	twap = 0;
	shock = 0;
	front = 0;
	back = 0;

	n = data.length
	if (i < n)
		return -1;
	else {
		
		for(i = 0; i < period; ++i)
		{
			try {
				sum += data[i].token0Price;
				++active;
			}
			catch {
				;
			}
		}
		console.log(sum);

		for(;i < n; ++i) {

			try{
				back = data[i -  period].token0Price;
				sum = sum - back;
				--active;
			}
			catch{
				;
			}

			try{
				front = data[i].token0Price;
				sum = sum + front;
				++active;

			}
			catch{
				;
			}

			twap = sum / active;
			shock = (front - twap) / front;
			
			console.log(sum, active, shock);
			
			if(shock > shocks.max.val)
			{
				shocks.max.val = shock;
				shocks.max.i = i;
				shocks.max.front = front;
				shocks.max.back = back;
			}
			else if (shock < shocks.min.val)
			{
				shocks.min.val = shock;
				shocks.min.i = i;
				shocks.min.front = front;
				shocks.min.back = back;
			}	
			else
				;
		}

		return shocks;

	}
}*/



main();