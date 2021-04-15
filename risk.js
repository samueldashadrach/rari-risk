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
			{
				query: str
			}
		);
		k = result.data.data.pair;
		k.blockno = String(blockno);
		return k;
	} catch(error){
		console.error(error);
	}
};

function main(){
	id = "0x0dacb47e00aed6abade32c7b398e029393e0d848";
	blockstart = 12244083;
	blockend = 12244185;
	data = [];

	for(blockno = blockstart; blockno < blockend; blockno+=1)
	{
		queryUniswap(id,blockno).then(
			value => {
				console.log(value);
				data.push(value);
			}
		);
	}
}


main();