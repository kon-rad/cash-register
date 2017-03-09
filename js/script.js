$(document).ready(function() {




    var price,
        i, 
        newLine = "<br>",
        $input = $('#input'),
        $output = $('#output'),
		cid = [["20", 0], ["10", 0], ["5", 0], ["2", 0], ["1", 0]];

	var total = 0;
	var totalCID = findTotal(cid);




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
		// allways crolls output window to bottom
		$output.animate({ scrollTop: $(document).height() }, "fast");
		}
	});

	function getChange(change) {
	  
	    if(change > totalCID) {
			return "Error: Insufficient funds in cash register";	    
	    }
	  
	    var dupl = JSON.parse(JSON.stringify(cid));
	  

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
			cid = dupl;
			return "Error: Insufficient funds in cash register";
		}
	  
    return output;
	}

	function take(com) {
				var cidCopy = cid.slice();
				for(i = 1; i < com.length; i++) {
					// Remove cash from register by use of parallel arrays
					cid[i - 1][1] -= parseInt(com[i]);
					if(cid[i - 1][1] < 0) {

						cid[i - 1][1] += parseInt(com[i]);

						return "Error: Insufficient funds in cash register";

					}
				}
				console.log(cid);
				console.log(cidCopy + " copy");
				// findTotal(cid);
				return show();		
	}

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



	function checkCashRegister(price, cash, cid) {

	  var bills = [["PENNY", 0.01], ["NICKEL", 0.05], ["DIME", 0.10], ["QUARTER", 0.25], ["ONE", 1.00], ["FIVE", 5.00], ["TEN", 10.00], ["TWENTY", 20.00], ["ONE HUNDRED", 100.00]];
	  var resultChange = [];
	  var i = cid.length - 1;



	  //Check if cash in drawer is sufficient
	  var change = cash - price;
	  console.log(change)

	  if (totalCID < change) {
	    return "Insufficient Funds";
	  } else if (totalCID == change) {
	    return "Closed";
	  }
	  // loop through bill amounts and add up change to give out
	  while (change > 0 && i >= 0) {
	    console.log(bills[i]);
	    if (change > bills[i][1] && (cid[i][1] > 0)) {
	      var output = [bills[i][0], 0];
	      // Deal with precision errors by using 0.99999
	      while ((change / bills[i][1] >= 0.99999) && (cid[i][1] > 0)) {
	        cid[i][1] -= bills[i][1];
	        change -= bills[i][1];
	        output[1] += bills[i][1];
	      }
	      resultChange.push(output);
	    }
	      i -= 1;
	  }

	  //Check if able to give change
	  if (resultChange.reduce(totalFunction)[1] < change) {
	    return "Insufficient Funds";
	  }
	  
	  console.log(change)
	  return resultChange;
	}


})