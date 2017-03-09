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
				console.log(com);
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
			return "Error: Insufficient funds in cash register";	    
	    }
	  
	    var backupCID = JSON.parse(JSON.stringify(cid));

	    // loop through denominations and add up change to give out
	    var output = "";
	    for(var i = 0; i < cid.length; i++) {

	  	var denomination = parseInt(cid[i][0]);
        var count = 0;

	    if (change >= denomination && (cid[i][1] > 0)) {
			  while ((change / denomination >= 1) && (cid[i][1] > 0)) {
			    cid[i][1]--;
			    change -= denomination;
			    count++;
			  }
			}
			output += count + "x" + denomination + " ";
		}	
		if(change > 0) {
			cid = backupCID;
			return "Error: Insufficient funds in cash register";
		}
    return output;
	}

    // Take Function
	function take(com) {
		for(i = 1; i < com.length; i++) {
			// Remove cash from register by use of parallel arrays
			cid[i - 1][1] -= parseInt(com[i]);
			if(cid[i - 1][1] < 0) {
				cid[i - 1][1] += parseInt(com[i]);
				return "Error: Insufficient funds in cash register";
			}
		}
		return show();		
	}

    // Show Function
	function show() {
		console.log(cid);
		totalCID = findTotal(cid);
		console.log(totalCID + " totals");
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