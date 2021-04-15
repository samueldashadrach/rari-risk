// source: https://www.youtube.com/watch?v=l2rzT_Dp4T0&ab_channel=EatTheBlocks

const fetch = require('node-fetch');

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

	try{
		const response = await fetch(
			"https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
			{
				method: "post",
				body: JSON.stringify( {query: str} ),
				headers: { "Content-Type": "application/json" }
			}
		).then((res) => res.json())
		.catch((err) => err.json());
		point = response.data.pair;
		point.blockno = blockno;
		return parse(point);
	} catch(error){
		console.error(error);
	}
};

const querymany = async(id, blockend, no_blocks) => {

	data = [];
	done = 0;

	for(blockno = blockend - no_blocks; blockno < blockend; ++blockno)
		{
			queryUniswap(id,blockno).then(
				value => {
					data.push(value);
					++done;
					console.log(value,done);
					if(done == no_blocks)
					{
						work(data);
					}
				},
				error => {
					console.log(error.toJSON());
					process.exit();
				}
			);
		}
}


function parse(point){
	point.reserve0 = parseFloat(point.reserve0);
	point.reserve1 = parseFloat(point.reserve1);
	point.token0Price = parseFloat(point.token0Price);
	point.token1Price = parseFloat(point.token1Price);
	return point;
}

function sleep(milliseconds) {
	console.log("sleeping");
	const date = Date.now();
	let currentDate = null;
	do {
    	currentDate = Date.now();
	} while (currentDate - date < milliseconds);
	console.log("waking up");
}

const main = async() => {
	
	const id =
	//"0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852"; // WETH-USDT
	"0x0dacb47e00aed6abade32c7b398e029393e0d848"; // SOCKS-ETH
	const END = 12244180;
	const no_blocks = 500;

	for(blockend = END; true ; blockend -= no_blocks)
	{
		console.log("a");
		f = await querymany(id,blockend,no_blocks);
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
	console.log(data);

	minliquidity = minliq(data);
	console.log(minliquidity);
}

function minliq(data){
	min = data[0].reserve0;
	for(i=1; i < data.length; i++)
	{
		if(data[i].reserve0 < min)
			min = data[i].reserve0;
	}
	return min;
}



main();