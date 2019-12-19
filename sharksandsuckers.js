'use strict';

const SHARKS_AND_SUCKERS = ( function(){   

const CellState =
{
	EMPTY: 0,  
   SHARK: 1,
   SUCKER: 2

};
if (Object.freeze) {
   Object.freeze(CellState);
}

/********************************************************
/*************** Neighbour info** ***********************
*********************************************************/
const NeighbourInfo = {

   NUM_SHARKS: 0,
   NUM_SUCKERS: 0,
   TOTAL: 0,
   
   create: function(numSharks, numSuckers) {
      let newInfo = Object.create(this);
      
      newInfo.NUM_SHARKS = numSharks;
      newInfo.NUM_SUCKERS = numSuckers;
	   newInfo.TOTAL = numSharks+numSuckers;
   
      return newInfo; 		
	
   }
   
   
 
};

/********************************************************
/*************** SurvivalRate Data **********************
*********************************************************/

const SurvivalData = {
   firstSharks: 0,
   initialSharks: 0,
   currentSharks: 0,
   
   firstSuckers: 0,
   initialSuckers: 0,
   currentSuckers: 0, 
   
   create: function() {
      let newData = Object.create(this);
      return newData; 		
	},
   
   init: function(numSharks, numSuckers) {
      this.firstSharks = numSharks;
      this.initialSharks= numSharks;
      this.currentSharks= numSharks;
     
      this.firstSuckers= numSuckers;
      this.initialSuckers= numSuckers;
      this.currentSuckers= numSuckers; 
      
   },
   
   log: function() {
      console.log("Sharks: " + this.firstSharks + ", " + this.initialSharks + ", " + this.currentSharks);
      console.log("Suckers: " + this.firstSuckers + ", " + this.initialSuckers + ", " + this.currentSuckers);
      
   },
   
   resetInitial: function() {
      this.initialSharks= 0;
      this.currentSharks= 0;
   
      this.initialSuckers= 0;
      this.currentSuckers= 0; 
      
   },
   
   // Return the proportion of sharks that have survived from
   // the first generation
   getSharkPercent: function() {
      if (this.firstSharks == 0 )
         this.firstSharks = this.initialSharks;
      
      if (this.firstSharks == 0 ) 
         return 0;
      
      return Math.ceil(( this.currentSharks / this.firstSharks ) * 100.0);
   },

   // Return the proportion of suckers that have survived from
   // the first generation
   getSuckerPercent: function() {
      if (this.firstSuckers == 0 )
         this.firstSuckers = this.initialSuckers;
      
      if (this.firstSuckers == 0 )
         return 0;
      return Math.ceil(( this.currentSuckers / this.firstSuckers ) * 100.0);
   },
   	
  
   // Return the proportion of sharks that have survived from
   // the PREVIOUS generation
   getSharkSurivialRate: function() {
      if (this.initialSharks == 0 )
         return 0;
      
      return Math.ceil(( this.currentSharks / this.initialSharks ) * 100.0);
   },

   // Return the proportion of suckers that have survived from
   // the PREVIOUS generation
   getSuckerSurvivalRate: function() {
      if (this.initialSuckers == 0 )
         return 0;
      
      return Math.ceil(( this.currentSuckers / this.initialSuckers ) * 100.0);
   },
   
   
   incSharks: function() {
      this.firstSharks++;
      this.initialSharks++;
      this.currentSharks++;
   },
   
   incSuckers: function() {
      this.firstSuckers++;
      this.initialSuckers++;
      this.currentSuckers++; 
      
   },
   
    decSharks: function() {
      this.firstSharks--;
      this.initialSharks--;
      this.currentSharks--;
   },
   
   decSuckers: function() {
      this.firstSuckers--;
      this.initialSuckers--;
      this.currentSuckers--; 
      
   },
   
   getText: function(sSharkLabel, sSuckerLabel) {
   	let sharkPercent = this.getSharkPercent();
      let suckerPercent = this.getSuckerPercent();
      let sSharks = sSharkLabel+": "+this.currentSharks+"/"+this.firstSharks+" ("+sharkPercent+"%)";
      let sSuckers = sSuckerLabel+": "+this.currentSuckers+"/"+this.firstSuckers+" ("+suckerPercent+"%)";
      let sLabelText = sSharks+"  " + sSuckers;
      return sLabelText;
   }
  
};




/********************************************************
/*************** Cell prototpe ** ***********************
*********************************************************/

const Cell =
{
   // Constructor
   create: function() {
      let newCell = Object.create(this);
      newCell.currentState = CellState.EMPTY;
      newCell.nextState = CellState.EMPTY;
      return newCell;
     
   },
   
   setState: function(state)
   {
      this.currentState = state;
      this.nextState = state;
   },

   clear: function() 
 	{
  		this.setState(CellState.EMPTY);	
  	},
  
  
   getCurrentState: function()
   {
      return this.currentState;   
   },
   
   getNextState: function()
   {
      return this.nextState;   
   },

      
   setNextState: function(state)
   {
      this.nextState = state;   
   },
   
   
   toggleState: function()
	{
		if ( this.currentState == CellState.EMPTY )
			this.setState( CellState.SUCKER );
		else
		if ( this.currentState == CellState.SUCKER )
			this.setState( CellState.SHARK );
		else
			this.setState( CellState.EMPTY );
			
		return this.currentState;
	}
	
};




/******************************************************************
/*******************  Grid prototype object ***********************
*******************************************************************/
const Grid = {
  
   sharkRatio: 0.5,
   suckerRatio: 0.5,
   emptyRatio: 0.5,
   
   create: function( xSize, ySize)
   {
      // check: xSize > 0 ySize > 0)
      let newGrid = Object.create(this);
      newGrid.init(xSize, ySize);
      return newGrid;
   },  

   init: function( xSize, ySize )
   {
      // check: xSize > 0 ySize > 0)
      
      this.cellArray = [];
      this.xSize = xSize;
      this.ySize = ySize;
      this.totalNumCells = xSize*ySize;
      this.bIsIterating = false;
      this.gridDisplay = null; 
      
      // Create a two dimensional array
      for (let i = 0; i < ySize; i++) {
         this.cellArray[i] = []; 
      }
   
      // Populate the array
      for (let y = 0; y < ySize; y++) {
         for (let x = 0; x < xSize; x++) {
            this.cellArray[x][y] = Cell.create(); 
         }
      }
      
      this.survivalData = SurvivalData.create();
           
   },  

   setGridDisplay: function( gridDisplay) {
      this.gridDisplay = gridDisplay;
   },
   
   clear: function() 
   {
      if ( this.bIsIterating )
         return;
      
       for (let y = 0; y < this.ySize; y++) {
         for (let x = 0; x < this.xSize; x++) {
            let cell = this.cellArray[x][y]; 
            cell.clear();
         }
      }
     
      this.survivalData.init(0,0);        
    
      if (this.gridDisplay && this.gridDisplay.bShowSurvivalRates ) {
         this.gridDisplay.showSurvivalRates();
      }
     
   },
   
  
   
   step: function()
   {
      if (this.bIsIterating )
         return;
      
      this.bIsIterating = true;
      this.computeNextGeneration();
      this.bIsIterating = false;
   },
   
   
   computeNextGeneration: function()
   {   
      this.computeNextStates();
   
      this.updateStates();
   
   },
   
   computeNextStates: function()
   {
   	for ( let x = 0; x < this.xSize; x++ )
      {
         for (let y = 0; y < this.ySize; y++ )
         {
            this.computeNext(x,y);  
         }
      }
      
   },
   
   // This function must be overriden in derived objects
   computeNext: function(x,  y )
   {
   },
   
   updateStates: function()
   {
      this.survivalData.resetInitial();
      
   	for ( let x = 0; x < this.xSize; x++ )
      {
         for ( let y = 0; y < this.ySize; y++ )
         {
         	
           	let cell = this.cellArray[x][y];
           	let nbi = this.getNeighbourInfo(x,y,true);
           
           
            let currentState = cell.currentState;
            let nextState = cell.nextState;
                       
            // Only need to count if showing survival rates, so could add test here
            this.updateSurvivalData(currentState, nextState);
            	
            if ( currentState != nextState )
            {
               cell.setState(nextState);
               
               if (this.gridDisplay) {
                  this.gridDisplay.paintCell(x,y,nextState);
               }
            }           
         }
      }  
      
      if ( this.gridDisplay && this.gridDisplay.bShowSurvivalRates )
      {
      	this.gridDisplay.showSurvivalRates(); 
      }
   },
   
   updateSurvivalData: function(currentState, nextState) 
   {
      if ( currentState == CellState.SHARK)
      {
         this.survivalData.initialSharks++;
      }
      else
      if ( currentState == CellState.SUCKER )
      {
         this.survivalData.initialSuckers++;
      }
            
      if ( nextState == CellState.SHARK )
      {
         this.survivalData.currentSharks++;
      }
      else
      if ( nextState == CellState.SUCKER )
      {
         this.survivalData.currentSuckers++;
      }
   },
   
   getNeighbourInfo: function(x, y, bIncludeSelf )
   {
      let numSharks = 0;
      let numSuckers = 0;
      let total = 0;
      let nxc = 0;
      let nyc = 0;
      for ( let nx = x-1; nx <= x+1; nx++ )
      {
         for ( let ny = y-1; ny <= y+1; ny++ )
         {
            if ( !bIncludeSelf && nx == x && ny == y )
               continue;
         
            
            nxc = nx;
            nyc = ny;     
            if ( nx == -1 )
	            nxc = this.xSize-1;
	         else
            if ( nx == this.xSize )
               nxc = 0;
            
            if ( ny == -1 )
               nyc = this.ySize-1;
            else
            if ( ny == this.ySize )
               nyc = 0;
            
            let neighbour = this.cellArray[nxc][nyc];
            let state = neighbour.currentState;
            if ( state == CellState.SHARK )
               numSharks++;
            if ( state == CellState.SUCKER )
               numSuckers++;
         }
      }
     
	   return NeighbourInfo.create(numSharks, numSuckers);
   },	

   getCell: function(x, y)
   {
      return this.cellArray[x][y];
   },

   setCell: function(x, y, state)
   {
         
      let cell = this.cellArray[x][y];
      cell.setState(state);
      
   },


	toggleCell: function(x, y)
	{
      let cell = this.cellArray[x][y];
      //let oldState = cell.getCurrentState();
      
      let newState = cell.toggleState();
      
      /*if (oldState == CellState.EMPTY) { // new state will be sucker
         this.survivalData.incSuckers();
      }
      else 
      if( oldState == CellState.SUCKER) { // new state will be shark
         this.survivalData.decSuckers();
         this.survivalData.incSharks();
      }
      else { // Changed from shark to empty
         this.survivalData.decSharks();
      }
      */
      return newState;
   },
   
   
   setSuckerRatio: function(suckerRatio)
   {
           
      if (suckerRatio >= 0 && suckerRatio <= 1) {
         this.suckerRatio = suckerRatio;
         this.sharkRatio = 1 - suckerRatio;
      }
      
   },
   
   randomize: function() 
   {   
      if ( this.bIsIterating )
         return;   
      
      let emptyCells = Math.ceil(this.totalNumCells * this.emptyRatio);
     
      let numFilledCells = this.totalNumCells - emptyCells;
   	let numSharkCells = Math.floor(numFilledCells * this.sharkRatio);
   	let numSuckerCells = numFilledCells - numSharkCells; 
      
      this.clear();
  		let suckersLeft = numSuckerCells;
  		while ( suckersLeft > 0 )
  		{
  			let xRand = this.getRandomNumber(this.xSize-1);
  			let yRand = this.getRandomNumber(this.ySize-1);
  			let cell = this.cellArray[xRand][yRand];
         if ( cell.getCurrentState() == CellState.EMPTY )
         {
         	cell.setState(CellState.SUCKER);
         	suckersLeft--;	
         }
  		}


  		let sharksLeft = numSharkCells;
  		while ( sharksLeft > 0 )
  		{
  			let xRand = this.getRandomNumber(this.xSize-1);
  			let yRand = this.getRandomNumber(this.ySize-1);
  			let cell = this.cellArray[xRand][yRand];
         if ( cell.getCurrentState() == CellState.EMPTY )
         {
         	cell.setState(CellState.SHARK);
         	sharksLeft--;	
         }
  		}
  		
      this.survivalData.init(numSharkCells,numSuckerCells);
        
      if (this.gridDisplay && this.gridDisplay.bShowSurvivalRates ) {
         this.gridDisplay.showSurvivalRates(); 
  	   }
     
   },
   
   getRandomNumber: function(max) {
      let randomNumber = Math.random();  
      let range = Math.floor((max + 1) * randomNumber);
      return range;
   }

   
 
   
}; // Grid prototype

/*******************************************************************
******************** SSGrid prototype ******************************
************* Inherits from Grid and adds computeNext **************
*******************************************************************/

const SSGrid = Object.create(Grid); // SSGrid inherits from Grid
SSGrid.create = function(xSize, ySize)
{
   let newSSGrid = Object.create(this)
   newSSGrid.init(xSize, ySize);
   return newSSGrid;
}

// Compute next rules for Sharks and Suckers
SSGrid.computeNext = function(x, y)
{
   let cell = this.cellArray[x][y];

   let neighbours = this.getNeighbourInfo(x,y,false);
   let numSharks = neighbours.NUM_SHARKS;
   let numSuckers = neighbours.NUM_SUCKERS;
   let total = neighbours.TOTAL;
	
   let currentState = cell.currentState;
   let nextState = currentState;
     
   if ( currentState == CellState.EMPTY )
   {
      if ( total == 2 )
      {
         if ( numSuckers == 2 )
            nextState = CellState.SUCKER;
         else
         if ( numSharks == 1 )
            nextState = CellState.SHARK;
         else
         if ( numSharks == 2 )
            nextState = CellState.EMPTY;
      }   
   }
   else
   {
      if ( total >= 3 )
         nextState = CellState.EMPTY;
      if ( total == 0 )
         nextState = CellState.EMPTY;
            
      if ( total == 2 )
      {
         if ( currentState == CellState.SUCKER )
         {
            if ( numSharks >=1 )
               nextState = CellState.EMPTY;     
         }      
         else
         if ( currentState == CellState.SHARK )
         {
            if ( numSharks == 2 )
               nextState = CellState.EMPTY;
         }            
      }
   }
      
   if ( nextState != currentState )
   {
      cell.setNextState(nextState);
   }
}

/***********************************************************************
******************** RLGrid prototype **********************************
************* Inherits from Grid and adds computeNext etc **************
************************************************************************/

const RLGrid = Object.create(Grid); // SSGrid inherits from Grid
RLGrid.create = function(xSize, ySize)
{
   let newRLGrid = Object.create(this)
   newRLGrid.init(xSize, ySize);
  
   this.REWARD = 1;
   this.SUCKERS_PAYOFF=0;
   this.TEMPTATION = 1.85;
   this.PUNISHMENT = 0;

   this.emptyRatio = 0.0;
   return newRLGrid;
}

RLGrid.computeNextGeneration = function()
{   
     
   this.computeScores();
         
   this.computeNextStates();
         
   this.updateStates();
      
}
  
RLGrid.computeScores = function()
{
   for ( let x = 0; x < this.xSize; ++x )
   {
      for ( let y = 0; y < this.ySize; ++y )
      {
         this.computeScore(x,y);       
      }
   }  
}
   
RLGrid.computeScore = function(x, y )
{
   // Compute score
   let RLCell = this.cellArray[x][y];
   RLCell.score = 0.0 ;
   let neighbours = this.getNeighbourInfo(x,y,true);
   let numSharks = neighbours.NUM_SHARKS;
   let numSuckers = neighbours.NUM_SUCKERS;
   let total = neighbours.TOTAL;
    	
   let currentState = RLCell.getCurrentState();
   let score = 0.0;
   if ( currentState == CellState.SUCKER )
   {
      score += numSuckers * this.REWARD;
      score += numSharks * this.SUCKERS_PAYOFF;
   }
   else
   if ( currentState == CellState.SHARK )
   {
      score += numSuckers * this.TEMPTATION;
      score += numSharks * this.PUNISHMENT;
   }
       
   RLCell.score = score; 
}
 
RLGrid.computeNext = function(x, y )
{
   let RLCell = this.cellArray[x][y];

   let highScore = RLCell.score; 
   let highestScoringCell = null;
   let nxc = 0;
   let nyc = 0;
   let highScores = 0;
      
   for ( let nx = x-1; nx <= x+1; nx++ )
   {
      for ( let ny = y-1; ny <= y+1; ny++ )
      {
         if ( nx == x && ny == y )
            continue;
               
         nxc = nx;
         nyc = ny;     
             
         if ( nx == -1 )
	         nxc = this.xSize-1;
	      else
         if ( nx == this.xSize )
            nxc = 0;
            
         if ( ny == -1 )
            nyc = this.ySize-1;
         else
         if ( ny == this.ySize )
            nyc = 0;
      
         let neighbour = this.cellArray[nxc][nyc];   
         let score = neighbour.score; 
         if ( score == highScore && highScores >= 1 )
         {
            if (neighbour.getCurrentState() != highestScoringCell.getCurrentState() )
            {
               // Two or more different types of cell are equal high scorers
               // In this case, just leave the cell alone.
               // System.out.println("CLASH!");
              highestScoringCell = null;
              nx = x+1;
              ny = y+1;
            }
         }
         else        
         if ( score > highScore )
         {
            highScore = score;
            highScores++;
            highestScoringCell = neighbour;  
         }
      }
   }            
      
   if ( highestScoringCell != null )
   {
      let newState = highestScoringCell.getCurrentState();
      RLCell.setNextState(newState);      
   }
}
    

/*****************************************************************
/*******************  SSGridDisplay object ***********************
******************** Handles display of a SSGrid ******************
******************** using HTML canvas object *********************
******************************************************************/

const SSGridDisplay = {
      
   sSharkLabel: "Sharks",
   sSuckerLabel: "Suckers",   

   create: function(numXCells, numYCells, sCanvasID, bShowSurvivalRates = false, sLabelID = "")
   {
      let newSSGrid = Object.create(this);
      newSSGrid.init(numXCells, numYCells, sCanvasID, bShowSurvivalRates, sLabelID);
      return newSSGrid;
   },
   
   init: function(numXCells, numYCells, sCanvasID, bShowSurvivalRates, sLabelID)
   {
      this.numXCells = numXCells;
      this.numYCells = numYCells;
      
      this.mainCanvas = document.querySelector(sCanvasID);
      if (!this.mainCanvas ) // throw exception
         return null;
     
      // Get 2d painting context
      this.ctx = this.mainCanvas.getContext("2d");
 
      
      // Create the grid object 
      this.grid = this.createGrid(numXCells, numYCells); 
      this.grid.setGridDisplay(this);      
            
      // Cache drawing parameters
      this.canvasWidth = this.mainCanvas.width;
      this.canvasHeight = this.mainCanvas.height;
	       
      this.leftMargin = 1; 
      this.rightMargin = 1; 
      this.topMargin =   1; 
      this.bottomMargin = 1; 
	   
      this.gridWidth = this.canvasWidth - ( this.leftMargin + this.rightMargin );
      this.gridHeight = this.canvasHeight - ( this.topMargin + this.bottomMargin );
	      
      this.cellWidth = Math.floor(this.gridWidth / numXCells);
      this.cellHeight = Math.floor(this.gridHeight /numYCells);
	   //console.log("CellWidth = " + this.cellWidth + " Cell Height = " + this.cellHeight);
      
      this.xCellMargin = 1;
      this.yCellMargin = 1;
      
      this.delay = 0;
      
      this.colours = { EMPTY_COLOUR: "LightGrey", SHARK_COLOUR: "blue", SUCKER_COLOUR: "red"};      
      
      this.bShowChanges = false;    
      this.bShowSurvivalRates = bShowSurvivalRates;   
      
      if (this.bShowSurvivalRates) {
         //console.log("datalabel = " + sLabelID);
         this.dataLabel = document.querySelector(sLabelID);
         //console.log(this.dataLabel);
         this.showSurvivalRates();
      }
      console.log("Created GridDisplay " + this.numXCells + " x " + this.numYCells);      
   },
   
   createGrid: function(numXCells, numYCells)
   {
      return SSGrid.create(numXCells, numYCells) ;
   },
   
   setDelay: function( msDelay ) {
      //console.log("setting delay = " + msDelay);
      this.delay = msDelay;
   },
   
   addMouseListener: function(fCallback)
   {
      this.mainCanvas.addEventListener("click", fCallback);
      
   },
   
   addDelaySlideListener: function(sSliderID, fCallback)
   {
      let slider = document.getElementById(sSliderID);
      slider.oninput = fCallback;
      slider.onchange = fCallback; // needed for IE ?
   },
   
   addSuckerRatioSlideListener: function(sSliderID, fCallback)
   {
      let slider = document.getElementById(sSliderID);
      slider.oninput = fCallback;
      slider.onchange = fCallback; // needed for IE ?
   },
   setSuckerRatio: function(suckerRatio) 
   {
      this.grid.setSuckerRatio(suckerRatio);
   },
   paint: function() 
   {
      this.stop_iterate();
      
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
   
      for ( let x = 0; x < this.numXCells; x++ )
      {
         for ( let y = 0; y < this.numYCells; y++ )
         {
      	    let cell = this.grid.getCell(x,y);
             let state = cell.getCurrentState();
             this.paintCell(x,y,state);   
         }   
      }
   },

   paintCell: function(x, y, state)
   {
      let color = this.colours.EMPTY_COLOUR;
      
      if ( state == CellState.SHARK )
         color = this.colours.SHARK_COLOUR; 
      else
      if ( state == CellState.SUCKER )
         color = this.colours.SUCKER_COLOUR;  
 
      this.ctx.fillStyle = color;
   
      this.ctx.fillRect((x*this.cellWidth)+this.leftMargin + this.xCellMargin,
                     (y*this.cellHeight)+this.topMargin + this.yCellMargin,
                     this.cellWidth - this.xCellMargin,
                     this.cellHeight - this.xCellMargin);   

    },
    
   toggleCell: function(x, y)
   {
           
      let state = this.grid.toggleCell(x,y);
      this.paintCell(x, y, state);
      if (this.bShowSurvivalRates)
         this.showSurvivalRates();
   },
   
   setCellShark: function(x, y)
   {
      this.grid.setCell(x,y,CellState.SHARK);
      this.paintCell(x,y,CellState.SHARK);
   },
   
   setCellSucker: function(x, y)
   {
      this.grid.setCell(x,y,CellState.SUCKER);
      this.paintCell(x,y,CellState.SUCKER);
   },
   
   clear: function()
   {
       if (this.bIsiterating )
          return;
       
       this.grid.clear();
       this.paint();
    },
    
    step: function()
    {
       if (this.bIsiterating )
          return;
       
       this.grid.step();
       
    },
    
    
    iterate: function()
    {
       if (this.bIsiterating ) {
          return;
       }
       
       this.bIsiterating = true;
       
       this.animateGrid(0, this);
    },
    
    stop_iterate: function()
    {
       if (!this.bIsiterating )
          return;
       
       this.bIsiterating = false; 
       cancelAnimationFrame(this.frameReq);
   },
    
   animateGrid: function(time, obj)
   {
      if ( !obj.bIsiterating )
         return;
   
      obj.grid.step();
      if (obj.delay ) {
         obj.sleep(obj.delay);
      }
         
      obj.frameReq = requestAnimationFrame( function(time) {obj.animateGrid(time, obj); } );
   },

    mouseClickEvent: function(event)
    {
      if (this.bIsiterating )
         return;
       
      let offLeft = this.mainCanvas.offsetLeft;
      let offTop = this.mainCanvas.offsetTop;
      
      // Use pageX and pageY so co-ordinates are correct when page is scrolled
      let xPos = event.pageX - offLeft; //  pageX; // clientX
		let yPos = event.pageY - offTop; //pageY // clientY
		
      //console.log("XPos = " + xPos + " yPos = " + yPos);
		
      let cellX = (xPos-this.leftMargin)/this.cellWidth;
      cellX = Math.floor(cellX);
      
      let cellY = (yPos-this.topMargin)/this.cellHeight;
      cellY = Math.floor(cellY);
      
      //console.log("CellX = " + cellX + " cellY = " + cellY);
		
      
      this.toggleCell(cellX, cellY);
		       
    },
    
   sleep: function(msDelay) {
      let  start = new Date().getTime();
      while ((new Date().getTime() - start) < msDelay);
   },
   
   randomize: function() {
      if (this.bIsiterating )
         return;
      
      this.grid.randomize();
      this.paint();
   },
   
   
   showSurvivalRates: function()
   {
    	if ( this.bShowSurvivalRates )
    	{
         let sd = this.grid.survivalData;
        // console.log("sd = " + sd);
         
         let sLabelText = sd.getText(this.sSharkLabel, this.sSuckerLabel);
         
      	//let sSharks = this.sSharkLabel+": "+sd.currentSharks+"/"+sd.firstSharks+" ("+sd.getSharkPercent()+"%)";
      	//let sSuckers = this.sSuckerLabel+": "+sd.currentSuckers+"/"+sd.firstSuckers+" ("+sd.getSuckerPercent()+"%)";
      	//let sLabelText = sSharks+"  " + sSuckers;
      
         //console.log(sLabelText);
         this.dataLabel.innerHTML = sLabelText;
      	
    	}
    }

   
   
}; // SSGridDisplay


/*****************************************************************
/*******************  RLGridDisplay object ***********************
****************** overrides colours and createGrid ***************
******************************************************************/

const RLGridDisplay = Object.create(SSGridDisplay); // Inherits from SSGridDisplay
RLGridDisplay.create = function(numXCells, numYCells, sCanvasID, bShowSurvivalRates = false, sLabelID = "")
{
   let newRLGrid = Object.create(this);
   
   newRLGrid.sSharkLabel="Rats";
   newRLGrid.sSuckerLabel="Lemmings";  
   
   newRLGrid.init(numXCells, numYCells, sCanvasID, bShowSurvivalRates, sLabelID);
    
   newRLGrid.colours = { EMPTY_COLOUR: "LightGrey", SHARK_COLOUR: "red", SUCKER_COLOUR: "yellow"};      
   
   
   return newRLGrid;
}



RLGridDisplay.createGrid = function(numXCells, numYCells)
{
   return RLGrid.create(numXCells, numYCells);
}

// Export two constructor functions
return {
    createSSGrid: function(xSize, ySize, sCanvasID, bShowSurvivalRates = false, sLabelID = "") 
      { return SSGridDisplay.create(xSize, ySize, sCanvasID, bShowSurvivalRates, sLabelID); },  
    createRLGrid: function(xSize, ySize, sCanvasID, bShowSurvivalRates = false, sLabelID = "") 
      { return RLGridDisplay.create(xSize, ySize, sCanvasID, bShowSurvivalRates, sLabelID); }  
   
}

})(); // end SHARKS_AND_SUCKERS module function
