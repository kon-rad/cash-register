$(document).ready(function() {

    var price,
        i, 
        newLine = "<br>",
        errorInsuf = "Error: Insufficient funds",
        errorFormat = "Error: Please enter correct format",
        clear = "<br><br><br><br><br><br><br><br><br><br><br>"
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

            // Show command
			if(com[0] == "show") {
				$output.append(newLine + show());
			// Clear command 
			} else if(com[0] == "clear") {
				$output.empty().append(clear);
			// Change command 
			} else if (com[0] == "change") {
				if(com.length != 2 || isNaN(parseInt(com[1]))) {
					$output.append(newLine + errorFormat); 
				} else {
					// return proper change
					$output.append(newLine + getChange(parseInt(com[1])));
				}
			// Check for correct format
			} else if (isNaN(parseInt(com[1])) || isNaN(parseInt(com[2])) || isNaN(parseInt(com[3])) 
				|| isNaN(parseInt(com[4])) || isNaN(parseInt(com[5])) || com.length != 6) {
				$output.append(newLine + errorFormat);
		    // Add command
			} else if(com[0] == "add") {
                add(com);
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
			return errorInsuf;	    
	    }
	  
	    var backupCID = JSON.parse(JSON.stringify(cid)),
	        backupChange = change,
	        countArr = [0, 0, 0, 0, 0];

	    // Loop through denominations and add up change to give out
	    iterateDenom();
	    
		if(change > 0) {
			// Reinstate cid from backup and attempt evenOdd function
			cid = JSON.parse(JSON.stringify(backupCID));
			change = backupChange;
			countArr = [0, 0, 0, 0, 0];

			evenOdd();
			iterateDenom();
		} 
		if (change > 0) {
			// Reinstate cid from backup and display error
			cid = JSON.parse(JSON.stringify(backupCID));
			return errorInsuf;
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

	// Add Function
	function add(com) {
		for(i = 1; i < com.length; i++) {
			// Add cash to register by use of parallel arrays
			cid[i - 1][1] += parseInt(com[i]);
		}
	}

    // Take Function
	function take(com) {
		for(i = 1; i < com.length; i++) {
			// Remove cash from register by use of parallel arrays
			cid[i - 1][1] -= parseInt(com[i]);
			if(cid[i - 1][1] < 0) {
				cid[i - 1][1] += parseInt(com[i]);
				return errorInsuf;
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

	// Find total cash in drawer function
	function findTotal(arr) {
		total = 0;
		for(i = 0; i < arr.length; i++) {
			total += arr[i][1] * parseInt(arr[i][0]);
		}
		return total;
	}

});