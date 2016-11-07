/* 
 * Forms a piet image which outputs sring repeatedly.
 * 
 * by Helen Wallace
 * Sept 2016
*/
function createImage() {
	var outputText = document.getElementById("outputText").value;
	var outputLength = outputText.length;
	console.log(outputText);
	console.log("outputLength" +outputLength);
	//find average ASCII value
	var numberOf36 = 0;
	var i=0;
	for(i=0;i<outputLength;i++){
		console.log(outputText.charAt(i));
		numberOf36 += Math.round(((outputText.charCodeAt(i))/36));
	}
	//make comand list (make 36)
	var commandList=[1,12,3,12,12,3,3,12,5];
	//push pointer
	var corner=[1,10];
	//make space
	var extra=[[1,5],[1,2],[1,6]];
	
	//dup 36	numberOf36 times
	for(i=0;i<numberOf36;i++){
		commandList[commandList.length] = 12;
	}
	console.log("outputLength" +outputLength);
	//for each calculate dif from numberOf36, create diff, add / subtract value
	for(i=0;i<outputLength;i++){
		console.log(outputText.charAt(i));
		var diff = outputText.charCodeAt(i)-(Math.round((outputText.charCodeAt(i))/36)*36);
		for(var j=1;j<Math.round((outputText.charCodeAt(i))/36);j++){
			commandList[commandList.length] = 3;
		}
		if(diff!=0){
			var diffArray = differenceComands(diff);
			console.log(diffArray);
			commandList = commandList.concat(diffArray);
		}
		commandList[commandList.length]=17;
		console.log(commandList);
	}
	console.log(commandList);
	console.log(commandList.length);
	var squareSize = findSquareSize(commandList.length + 1);
	console.log(squareSize);
	opsInSquare = opsin(squareSize);
	//start at 15=
	var colourArray=[15];
	for(i=0;i<commandList.length;i++){
		colourArray[i+1]=opColour(commandList[i],colourArray[i]);
	}
	console.log(colourArray);
	console.log(colourArray.length);
	//check for colour clashes and adjust comand list padding (push / pop)
	//loop
	//make image
	var p = new PNGlib(squareSize*10,squareSize*10,256); // construcor takes height, weight and color-depth
	var background = p.color(0xFF, 0xFF, 0xFF);
	//put colours into image	
	var lightRed = p.color(0xFF, 0xC0, 0xC0 ); //0
	var lightYellow	= p.color(0xFF, 0xFF, 0xC0 ); //1
	var lightGreen = p.color(0xC0, 0xFF, 0xC0 ); //2
	var lightCyan = p.color(0xC0, 0xFF, 0xFF );	//3
	var lightBlue = p.color(0xC0, 0xC0, 0xFF );	 //4
	var lightMagenta = p.color(0xFF, 0xC0, 0xFF ); //5
	var red = p.color(0xFF, 0x00, 0x00 ); //6
	var yellow = p.color(0xFF, 0xFF, 0x00 );  //7
	var green = p.color(0x00, 0xFF, 0x00 );  //8
	var cyan = p.color(0x00, 0xFF, 0xFF );  //9
	var blue = p.color(0x00, 0x00, 0xFF );  //10
	var magenta = p.color(0xFF, 0x00, 0xFF ); //11
	var darkRed = p.color(0xC0, 0x00, 0x00 );  //12
	var darkYellow = p.color(0xC0, 0xC0, 0x00 );	//13
	var darkGreen = p.color(0x00, 0xC0, 0x00 );	//14
	var darkCyan = p.color(0x00, 0xC0, 0xC0 );	//15
	var darkBlue = p.color(0x00, 0x00, 0xC0 );	  //16
	var darkMagenta = p.color(0xC0, 0x00, 0xC0 );  //17
	var white = p.color(0xFF, 0xFF, 0xFF );	
	var black = p.color(0x00, 0x00, 0x00 );
	var colours=[
		lightRed, red, darkRed, 
		lightYellow, yellow, darkYellow, 
		lightGreen, green, darkGreen,
		lightCyan, cyan, darkCyan,
		lightBlue, blue, darkBlue,
		lightMagenta, magenta, darkMagenta
		];
	var direction = 0; //0=right,1=down,2=left,3=up
	var cur = squareSize;
	var prev = squareSize;
	var done = 0;
	var xCoor = 0;
	var yCoor = 0;
	for (i = 0; i < colourArray.length; i++) {
		//refers to current colour box
		console.log("pixel " + i + "    ("+xCoor+", "+ yCoor+")");
		console.log(direction+ ",  " + squareSize+ ",  " + done);
		//insert pixels in 10*10 Square j and k counters
		var j=0;//horizontal
		var k=0;//vertical
		for(j=0; j<10;j++){
			for(k=0; k<10;k++){
				p.buffer[p.index(xCoor*10+j, yCoor*10+k)] = colours[colourArray[i]];
			}
		}
		done++;
		//direction adjustments
		if(done==squareSize){
			done=1;
			direction++;
			if(direction>3)
				direction=0;
		}
		//find coord of next
		if(direction==0)
			xCoor++;
		else if(direction==1)
			yCoor++;
		else if(direction==2)
			xCoor--;
		else
			yCoor--;
	}
	document.write('<img src="data:image/png;base64,'+p.getBase64()+'">');
}
//find next colour based on op and current colour
function opColour(op,colour){
	
	var hueChange = (op-(op%3))/3;
	var darknessChange = op%3;
	var darkness = ((colour%3) + darknessChange) %3;
	var hue = (((colour-(colour%3))/3) + hueChange)%6;
	var outcolour = hue*3 + darkness;
	//console.log("colour=" + colour + ". op=" + op+". outcolour=" + outcolour);
	//console.log("hue" + hue + " -> " + Math.round(colour/3) + " and " + hueChange);
	//console.log("darkness" + darkness + " -> " + (colour%3) + " and " + darknessChange);
	return outcolour;
}
//return commands to get difference from 36n
function differenceComands(diff){
	var diffOnStack = onStack(Math.abs(diff));
	var join;
	if(diff>=0){
		join = 3;
	}
	else join =4;
	diffOnStack[diffOnStack.length]=join;
	return diffOnStack;
}
function onStack(number){
	console.log(number);
	switch (number) {
    case 1:
        return [1];
    case 2:
        return [1,12,3];
    case 3:
        return [1,12,3,1,3];
    case 4:
        return [1,12,3,12,3];
    case 5:
        return [1,12,3,12,3,1,3];
    case 6:
        return [1,12,3,12,12,3,3];
	case 7:
		return [1,12,3,12,12,3,3,1,3];
    case 8:
        return [1,12,3,12,3,12,3];
    case 9:
        return [1,12,3,1,3,12,5];
    case 10:
        return [1,12,3,12,3,1,3,12,3];
	case 11:
        return [1,12,3,12,3,1,3,12,3,1,3];
    case 12:
        return [1,12,3,12,12,12,3,3,5];
    case 13:
        return [1,12,3,12,12,12,3,3,5,1,3];
    case 14:
        return [1,12,3,12,12,12,3,3,1,3,5];
    case 15:
        return [1,12,3,12,3,12,5,1,4];
    case 16:
        return [1,12,3,12,3,12,5];
	case 17:
		return [1,12,3,12,3,12,5,1,3];
    case 18:
        return [1,12,3,12,1,3,12,5,5];
    case 19:
        return [1,12,3,12,1,3,12,5,5,1,3];
    case 20:
        return [1,12,3,12,12,1,3,12,5,5,3];	
	}
}
function findSquareSize(numOps){
	for( var squareSize = 2; squareSize < 100; squareSize = squareSize+1){
		if( opsin(squareSize)>numOps){
			return squareSize;
		}
	}
}
function opsin(x){
	return (x-1)*4;
}