// source: https://www.youtube.com/watch?v=l2rzT_Dp4T0&ab_channel=EatTheBlocks

const axios = require("axios");

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
		const result = await axios.post(
			"https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
			{ query: str },
			{ timeout: 100000 }

		);
		point = result.data.data.pair;
		point.blockno = blockno;
		return parse(point);
	} catch(error){
		console.error(error);
	}
};


function parse(point){
	point.reserve0 = parseFloat(point.reserve0);
	point.reserve1 = parseFloat(point.reserve1);
	point.token0Price = parseFloat(point.token0Price);
	point.token1Price = parseFloat(point.token1Price);
	return point;
}

const id =
//"0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852"; // WETH-USDT
"0x0dacb47e00aed6abade32c7b398e029393e0d848"; // SOCKS-ETH
const blockend = 12244180;
const no_blocks = 1000;

function main(){
	data = [];
	done = 0;

	for(blockno = blockend - no_blocks; blockno < blockend; ++blockno)
	{
		queryUniswap(id,blockno).then(
			value => {
				data.push(value);
				++done;
				console.log(done);
				if(done == no_blocks)
					work(data);
			},
			error => {
				console.log(error.toJSON());
				process.exit();
			}
		);
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

	minliq(data);

}

function minliq(data){
	min = data[0].reserve0;
	for(i=1; i < no_blocks; i++)
	{
		if(data[i].reserve0 < min)
			min = data[i].reserve0;
	}
	console.log(min);
	return min;
}



main(); // pssst..