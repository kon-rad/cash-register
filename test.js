
    var price,
        i, 
		cid = [["20", 1], ["10", 0], ["5", 3], ["2", 4], ["1", 0]],
		total = 0,
		totalCID = findTotal(cid);



	function getChange(change) {
	  
	    if(change > totalCID) {
			return "Error: Insufficient funds";	    
	    }
	  
	    var backupCID = JSON.parse(JSON.stringify(cid));
	    var backupChange = change;

		var countArr = [0, 0, 0, 0, 0];

	    // loop through denominations and add up change to give out
	    iterateDenom();
	    console.log("change: " + change + " countArr: " + countArr + " cid: " + cid)
	    
		if(change > 0) {
			cid = backupCID;
			change = backupChange;
			countArr = [0, 0, 0, 0, 0];
			evenOdd();
			iterateDenom();
		} 
		if (change > 0) {
			console.log("change " + change + ' change greater than 0 and countArr:' + countArr)
			return "Error: Insufficient funds";
		} else {
	        return createOutput(countArr);
		}

		// Iterate over denominations
		function iterateDenom() {

		    for(i = 0; i < cid.length; i++) {
		    	console.log("change: " + change + " countArr: " + countArr);

			  	var denomination = parseInt(cid[i][0]);

			    if (change >= denomination && (cid[i][1] > 0)) {

			    	var remove = Math.floor(change / denomination);
			    	if(remove > 0) {
			    		change -= (remove * denomination);
			    		cid[i][1] -= remove;
			    		countArr[i] += remove;
			    	} 
				} 
			}	
		}

		function evenOdd() {
			if(cid[3][1] >= 3 && change >= 6) {
				cid[3][1] -= 3;
				change -= 6;
				countArr[3] += 3;
			}
		}
	}

	//Find total cash in drawer function
	function findTotal(arr) {
		total = 0;
		for(var i = 0; i < arr.length; i++) {
			total += arr[i][1] * parseInt(arr[i][0]);
		}
		return total;
	}

	// Create change output string
	function createOutput(arr) {
		return arr[0] + "x20 " + arr[1] + "x10 " 
		    + arr[2] + "x5 " + arr[3] + "x2 " + arr[4] + "x1";
	}




	console.log(getChange(18));