$(document).ready(function() {

    var price,
        i, 
        newLine = "<br>",
        $input = $('#input'),
        $output = $('#output'),
		cid = [["20", 0], ["10", 0], ["5", 0], ["2", 0], ["1", 0]],
		total = 0,
		totalCID = findTotal(cid);

    $('#input').on()

	// Function on keypress "Enter"
	$input.keypress(function(e){

		if (e.keyCode === 13) {
		  var inputText = $input.val().trim();
		  $output.append(newLine + inputText);
		  com = inputText.toLowerCase().split(' ');

            // show command
			if(com[0] == "show") {
				$output.append(newLine + show());
			// change command 
			} else if (com[0] == "change") {
				if(com.length != 2 || isNaN(parseInt(com[1]))) {
					$output.append(newLine + "Error: please enter correct format"); 
				} else {
					// return proper change
					$output.append(newLine + getChange(parseInt(com[1])));
				}
			// check if numbers are entered
			} else if (isNaN(parseInt(com[1])) || isNaN(parseInt(com[2])) || isNaN(parseInt(com[3])) 
				|| isNaN(parseInt(com[4])) || isNaN(parseInt(com[5])) || com.length != 6) {
				
				$output.append(newLine + "Error: please enter correct format");
		    // add command
			} else if(com[0] == "add") {
				for(i = 1; i < com.length; i++) {
					// Add cash to register by use of parallel arrays
					cid[i - 1][1] += parseInt(com[i]);
				}
				$output.append(newLine + show());
		    // Take command
			} else if(com[0] == "take") {
				$output.append(newLine + take(com));
			} 
		$input.val('');
		// Make output window allways scroll to bottom
		$output.animate({ scrollTop: $(document).height() }, "fast");
		}
	});

	function getChange(change) {
	  
	    if(change > totalCID) {
			return "Error: Insufficient funds";	    
	    }
	  
	    var backupCID = JSON.parse(JSON.stringify(cid));
	    var backupChange = change;

		var countArr = [0, 0, 0, 0, 0];

	    // loop through denominations and add up change to give out
	    iterateDenom();
	    
		if(change > 0) {
			console.log("1st, before, cid: " + cid + " backupCID: " + backupCID)
			cid = JSON.parse(JSON.stringify(backupCID));
			console.log("1st, after, cid: " + cid + " backupCID: " + backupCID)

			change = backupChange;
			countArr = [0, 0, 0, 0, 0];
			evenOdd();
			iterateDenom();
		} 
		if (change > 0) {
			console.log("2nd before cid: " + cid + " backupCID " + backupCID);
			cid = JSON.parse(JSON.stringify(backupCID));
			console.log("2nd after cid: " + cid + " backupCID " + backupCID);
			return "Error: Insufficient funds";
		} else {
	        return createOutput(countArr);
		}

		// Iterate over denominations
		function iterateDenom() {

		    for(i = 0; i < cid.length; i++) {

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

	// Create change output string
	function createOutput(arr) {
		return arr[0] + "x20 " + arr[1] + "x10 " 
		    + arr[2] + "x5 " + arr[3] + "x2 " + arr[4] + "x1";
	}	

    // Take Function
	function take(com) {
		for(i = 1; i < com.length; i++) {
			// Remove cash from register by use of parallel arrays
			cid[i - 1][1] -= parseInt(com[i]);
			if(cid[i - 1][1] < 0) {
				cid[i - 1][1] += parseInt(com[i]);
				return "Error: Insufficient funds";
			}
		}
		return show();		
	}

    // Show Function
	function show() {
		totalCID = findTotal(cid);
		var displayString = "$" + totalCID;
		for(i = 0; i < cid.length; i++) {
		    displayString += " " + cid[i][1] + "x" + cid[i][0];
		}
		return displayString;
	}

	//Find total cash in drawer function
	function findTotal(arr) {
		total = 0;
		for(var i = 0; i < arr.length; i++) {
			total += arr[i][1] * parseInt(arr[i][0]);
		}
		return total;
	}

});