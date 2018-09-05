/*
 * Canvas Letters
 *
 */
var canvasLetters = function() {

  /*
   * The HTML body element
   */
  var body = null,

  /*
   * The canvas HTMl element
   */
  canvas = null,

  /*
   * The canvas draw context
   */
  drawContext = null,

  /*
   * The draw interval
   */
  drawInterval = null,

  /*
   * Bool - are we currently recalculating?
   */
  redrawing = false,

  /*
   * Bool - are we currently reversing
   */
  reversing = false,

  /*
   * Array of blocks to draw
   */
  blocks = [],
  blockCount = 0,

  /*
   * current block drawing details
   */
  currentX = 0,
  currentY = 0,
  currentBlock = 0,
  lineCount = 1,

  /*
   * Character block dimensions
   */
  characterBlockWidth = 5,
  characterBlockHeight = 7,

  /*
   * the (potentially modified) text string we're drawing
   */
  textString = "",

  /*
   * the next string to use (retrieved via ajax)
   */
  nextString = "",

  /*
   * Are we waiting for the next message?
   */
  requestingNextString = false,

  /*
   * Debug timeout
   */
  debugTimeout = null,

  /*
   * colour combinations for bg/fg
   */
  blockColours = [
    "ff9900", //orange
    "ffffff", // white
    "cccccc", // grey
    "ffff00", // yellow
    "00ffff", //cyan
    "ff00ff", //magenta
    "00ff00"  //green

  ],

  /*
   * ordering types
   */
   orderingTypes = [
    'default', 'horizontal', 'vertical', 'random'
   ],

  /*
   * Characters
   */
  characters = {
    "a": [0,0,1,0,0,0,1,0,1,0,1,0,0,0,1,1,0,0,0,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,1],
    "b": [1,1,1,1,0,1,0,0,0,1,1,0,0,0,1,1,1,1,1,0,1,0,0,0,1,1,0,0,0,1,1,1,1,1,0],
    "c": [0,1,1,1,0,1,0,0,0,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,1,1,1,0],
    "d": [1,1,1,0,0,1,0,0,1,0,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,1,0,1,1,1,0,0],
    "e": [1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,1,1,0,0,1,0,0,0,0,1,0,0,0,0,1,1,1,1,1],
    "f": [1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,1,1,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0],
    "g": [0,1,1,1,0,1,0,0,0,1,1,0,0,0,0,1,0,1,1,1,1,0,0,0,1,1,0,0,0,1,0,1,1,1,1],
    "h": [1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1],
    "i": [1,1,1,1,1,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,1,1,1,1,1],
    "j": [1,1,1,1,1,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,1,1,0,0],
    "k": [1,0,0,0,1,1,0,0,1,0,1,0,1,0,0,1,1,0,0,0,1,0,1,0,0,1,0,0,1,0,1,0,0,0,1],
    "l": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,1,1,1,1],
    "m": [1,0,0,0,1,1,1,0,1,1,1,0,1,0,1,1,0,1,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1],
    "n": [1,0,0,0,1,1,0,0,0,1,1,1,0,0,1,1,0,1,0,1,1,0,0,1,1,1,0,0,0,1,1,0,0,0,1],
    "o": [0,1,1,1,0,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,0,1,1,1,0],
    "p": [1,1,1,1,0,1,0,0,0,1,1,0,0,0,1,1,1,1,1,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0],
    "q": [0,1,1,1,0,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,1,0,1,1,0,0,1,0,0,1,1,0,1],
    "r": [1,1,1,1,0,1,0,0,0,1,1,0,0,0,1,1,1,1,1,0,1,0,1,0,0,1,0,0,1,0,1,0,0,0,1],
    "s": [0,1,1,1,0,1,0,0,0,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,0,0,0,1,0,1,1,1,0],
    "t": [1,1,1,1,1,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0],
    "u": [1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,0,1,1,1,0],
    "v": [1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,0,1,0,1,0,0,1,0,1,0,0,0,1,0,0,0,0,1,0,0],
    "w": [1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,0,1,0,1,0],
    "x": [1,0,0,0,1,1,0,0,0,1,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,1,1,0,0,0,1],
    "y": [1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,0,1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0],
    "z": [1,1,1,1,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,1,1,1,1],
    "0": [0,1,1,1,0,1,0,0,0,1,1,0,0,1,1,1,0,1,0,1,1,1,0,0,1,1,0,0,0,1,0,1,1,1,0],
    "1": [0,0,1,0,0,0,1,1,0,0,1,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,1,1,1,1,1],
    "2": [0,1,1,1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,1,1,1,1],
    "3": [0,1,1,1,0,1,0,0,0,1,0,0,0,0,1,0,0,1,1,0,0,0,0,0,1,1,0,0,0,1,0,1,1,1,0],
    "4": [0,0,0,1,0,0,0,1,1,0,0,1,0,1,0,1,0,0,1,0,1,1,1,1,1,0,0,0,1,0,0,0,0,1,0],
    "5": [1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,1,1,1,0,0,0,0,0,1,1,0,0,0,1,0,1,1,1,0],
    "6": [0,0,1,1,0,0,1,0,0,0,1,0,0,0,0,1,1,1,1,0,1,0,0,0,1,1,0,0,0,1,0,1,1,1,0],
    "7": [1,1,1,1,1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0],
    "8": [0,1,1,1,0,1,0,0,0,1,1,0,0,0,1,0,1,1,1,0,1,0,0,0,1,1,0,0,0,1,0,1,1,1,0],
    "9": [0,1,1,1,0,1,0,0,0,1,1,0,0,0,1,0,1,1,1,1,0,0,0,0,1,0,0,0,1,0,0,1,1,0,0],
    " ": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "!": [0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0],
    "@": [0,1,1,1,0,1,0,0,0,1,1,0,1,1,1,1,0,1,0,1,1,0,1,1,0,1,0,0,0,1,0,1,1,1,0],
    "€": [0,0,1,0,0,0,1,0,1,0,1,0,0,0,1,1,1,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,1,0,0],
    "£": [0,0,1,0,0,0,1,0,1,0,1,0,0,0,1,1,1,1,0,0,1,0,0,0,0,1,0,0,0,1,1,1,1,1,1],
    "#": [0,0,0,0,0,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,0,0,0,0,0],
    "$": [0,0,1,0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0,1,0,0],
    "%": [0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0],
    "^": [0,0,1,0,0,0,1,0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "&": [0,1,1,0,0,1,0,0,1,0,1,0,1,0,0,0,1,0,0,0,1,0,1,0,1,1,0,0,1,0,0,1,1,0,1],
    "*": [1,0,1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0],
    "(": [0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
    ")": [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0],
    "-": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "_": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1],
    "+": [0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,1,1,1,1,1,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0],
    "=": [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
    "[": [1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,1,1,1,1],
    "]": [1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1],
    "{": [0,1,1,1,1,0,1,0,0,0,0,1,0,0,0,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,1,1,1],
    "}": [1,1,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,1,0,0,0,1,0,0,0,0,1,0,1,1,1,1,0],
    ":": [0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0],
    ";": [0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,1,1,0,0,0],
    "\"":[0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "'": [0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "|": [0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0],
    "\\":[0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0],
    "~": [0,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "`": [0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    "<": [0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
    ",": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,1,1,0,0,0],
    ">": [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0],
    ".": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0],
    "?": [0,1,1,1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0],
    "/": [0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0]
  },



  /*
   * default options
   * (the ones to copy from if an option isn't specified specifically)
   */
  defaults = {
    inline : false,
    canvasId : null,
    blockColour : blockColours[0],
    backgroundColour : "000000",
    blockSize : 12,
    textString : "abcdefghijklmnopqrstuvwxyz0123456789!@€£#$%^&*()-_+=[]{}:;\'|\~`<,>.?/",
    breakWord : false,
    clearance : 20,
    ordering : orderingTypes[0],
    loop : true,
    speed : 5,
    animate : true,
    ajaxUrl : null,
    debugMode : false
  },

  /*
   * config options
   * (the combined options, the ones to use)
   */
  options = {},


   /*
   * initialisation method
   */
  init = function(initOptions){

    debug("init()");

    // save the init options
    saveOptions(initOptions);

    // create canvas element
    if (!canvas) {
      createCanvas();
    }

    // init canvas set-up
    startLetters();

    // reset on resize
    if (!options.inline) {
      window.onresize = function() {
        startLetters();
      };
    }
  },


  /*
   * save any options sent through to the intialisation script, if set
   */
  saveOptions = function(initOptions) {

    debug('saveOptions()');

    for (var option in defaults) {
      if (!!initOptions[option] || initOptions[option] === false) {
        options[option] = initOptions[option];
      } else {
        options[option] = defaults[option];
      }
    }
  },



  /*
   * Create canvas element
   */
  createCanvas = function() {

    debug("createCanvas()");

    // condition : if we are creating a full-screen canvas
    if (!options.inline) {

      // create canvas
      canvas = document.createElement('canvas');
      canvas.id = "canvas";
      canvas.style.position = "absolute";
      canvas.style.zIndex = 1;
      canvas.style.left = 0;
      canvas.style.top = 0;

      // add the canvas into the page
      body = document.getElementsByTagName('body')[0];
      body.appendChild(canvas);

    // if we are using an existing canvas element inline in the page
    } else {
      canvas = document.getElementById(options.canvasId);
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    // get the draw context
    drawContext = canvas.getContext("2d");
  },



  /*
   * Start letters
   */
  startLetters = function() {

    debug('startLetters()');

    // catch multiple calls
    if (!redrawing) {

      redrawing = true;

      clearInterval(drawInterval);

      // init values
      lineCount = 1;
      currentBlock = 0;
      blocks = [];
      blockCount = 0;
      reversing = false;
      currentX = options.clearance;
      currentY = options.clearance;

      // set a random ordering type
      options.ordering = orderingTypes[Math.floor(Math.random()*orderingTypes.length)];
      options.blockColour = blockColours[Math.floor(Math.random()*blockColours.length)];

      // set up functions
      if (!options.inline) {
        setCanvasWidth();
      }
      fixTextLength();
      calculateBlockPositions();
      if (!options.inline) {
        setCanvasHeight();
      }

      // if we're not animating, show everything at once
      if (!options.animate) {
        currentBlock = blocks.length;
      }

      // draw background
      drawContext.fillStyle = "#"+options.backgroundColour;
      drawContext.fillRect(0, 0, canvas.width, canvas.height);

      // start loop
      drawInterval = setInterval(draw, options.speed);

      // retrieve the next message
      if (!!options.ajaxUrl) {
        retrieveNextMessage();
      }

      // redrawing complete!
      redrawing = false;
    }
  },


  /*
   *
   */
  setCanvasWidth = function() {
    canvas.width = document.body.offsetWidth;

    debug("setCanvasWidth()");
  },


  /*
   *
   */
  setCanvasHeight = function() {
    var canvasHeight = (lineCount*(characterBlockHeight*options.blockSize))+((lineCount+2)*options.clearance);
    if (canvasHeight < document.documentElement.clientHeight) { canvasHeight = document.documentElement.clientHeight; }
    canvas.height = canvasHeight;

    debug("setCanvasHeight() - " + canvasHeight + " ("+lineCount+" lines)");
  },


  /*
   *
   */
  fixTextLength = function() {

    debug('fixTextLength()');

    textString = options.textString.toLowerCase();

    // calculate line length
    var lineLength = Math.floor( ( canvas.width - options.clearance ) / ( ( characterBlockWidth * options.blockSize ) + options.clearance ) );
    debug('fixTextLength() - line length: ' + lineLength);

    // test each word invidivually
    textStringArray = textString.split(" ");
    for (var counter = textStringArray.length - 1; counter >= 0; counter--){

      // if any words are longer than the line-length, hyphenate
      if (textStringArray[counter].length > lineLength) {

        var originalWord = word = textStringArray[counter];
        var wordArray = [];

        debug('fixTextLength() - word is too long: ' + word);

        // split the word every time it hits the line length
        while (word.length > lineLength) {
          wordArray.push(word.substr(0, lineLength-1));
          word = word.substr(lineLength-1);
        }
        wordArray.push(word);

        textString = textString.replace(originalWord, wordArray.join("- "));
      }
    };

  },



  /*
   *
   */
  calculateBlockPositions = function() {

    debug('calculateBlockPositions()');

    // draw the text string
    for (var character = 0, textStringLength = textString.length; character < textString.length; character++) {

      // if we can draw this letter, begin
      if (!!characters[textString[character]] || textString[character] == "§") {

        // if this isn't the first character, work out how far along the line to put it
        if (character > 0) {
          currentX += (options.blockSize * characterBlockWidth) + options.clearance;
        }

        // find the position of the next space (to calculate the word length)
        var nextSpacePosition = textString.indexOf(" ", character);
        if (nextSpacePosition == -1) { nextSpacePosition = textStringLength; }

        // start working out where to place the new letter/word
        var newLineRequired = false;


        // condition : if we're not breaking words then check the whole word will fit on the next line
        if (!options.breakWord) {

          // condition : is this word going to fit on the current line?
          if (currentX + (options.blockSize * (characterBlockWidth*(nextSpacePosition-character))) + (options.clearance*(nextSpacePosition-character)) > canvas.width - options.clearance) {
            newLineRequired = true;
          }

        // breaking words is fine
        } else {
          // condition : is this letter going to fit on the current line?
          if (currentX + (options.blockSize * characterBlockWidth) > canvas.width - options.clearance) {
            newLineRequired = true;
          }
        }

        if (textString[character] == "§") {
          debug("§ - forcing new line!");
          newLineRequired = true;
          textString[character] = "";
        }

        // condition : start a new line?
        if (newLineRequired && textString[character] != " ") {
          currentX = options.clearance;
          currentY = (lineCount*(characterBlockHeight*options.blockSize)) + (options.clearance*++lineCount);
        }


        // get the blocks for this character
        var blockArray = characters[textString[character]];
        if (blockArray) {
          // for each block within a character
          for (var block = 0, blockArrayLength = blockArray.length; block < blockArrayLength; block++) {

            // calculate X & Y positions for each block
            var x = currentX;
            var y = currentY;
            x += (options.blockSize * (block % characterBlockWidth));
            if (block >= characterBlockWidth) {
              y += (options.blockSize*(Math.floor(block/characterBlockWidth)));
            }

            // if we're drawing a block, add it to the array
            if (blockArray[block] == 1) {
              blocks.push({x:x,y:y,opacity:0});
            }
          }
        }
      } else {
        debug("calculateBlockPositions() - letter not recognised: " + textString[character]);
      }
    }

    // condition : change order of appearing blocks
    switch (options.ordering) {
      case "vertical":
        function vertical(a, b) { return a.y - b.y; }
        blocks.sort(vertical);
      break;

      case "horizontal":
        function horizontal(a, b) { return a.x - b.x; }
        blocks.sort(horizontal);
      break;

      case "reverse":
        blocks.reverse();
      break;

      case "random":
        function randOrd(){ return (Math.round(Math.random())-0.5); }
        blocks.sort(randOrd);
      break;
    }


    blockCount = blocks.length;
    debug('calculateBlockPositions() - block count: ' + blockCount);
  },



  /*
   *
   */
  drawCircle = function(x,y,r) {
    drawContext.beginPath();
    drawContext.arc(x, y, r, 0, Math.PI*2, true);
    drawContext.closePath();
    drawContext.fill();
  },


  /*
   *
   */
  drawRectangle = function(x,y,w,h) {
    drawContext.beginPath();
    drawContext.rect(x,y,w,h);
    drawContext.closePath();
    drawContext.fill();
  },



  /*
   *
   */
  draw = function() {

    // normal direction, add blocks
    var drawColour = (!reversing) ? options.blockColour : options.backgroundColour;

    // calculate which blocks to work on
    var animateLimit = (!!options.animate) ? currentBlock-10 : 0;

    // loop through blocks and draw!
    for (var counter = animateLimit; counter < currentBlock; counter++) {
      if (!!blocks[counter]) {
        if (blocks[counter].opacity < 1) { blocks[counter].opacity += 0.1; }
        drawContext.fillStyle = "rgba("+HexToRGB(drawColour)+", "+blocks[counter].opacity+")";
        drawRectangle(blocks[counter].x, blocks[counter].y, options.blockSize, options.blockSize);
        //drawCircle(blocks[counter].x, blocks[counter].y, options.blockSize);
      }
    };

    // add one to loop
    currentBlock++;

    // calculate whether to end the drawing
    if (currentBlock == blockCount+10) {
      clearInterval(drawInterval);
      if (options.loop && options.animate) {
        resetBlocks();
      }
    }
  },


  /*
   * called when we get to the end of an animation (showing/hiding all blocks)
   */
  resetBlocks = function() {

    // set the new sentence and restart
    if (reversing) {

      // next string is ready, proceed
      if (!requestingNextString) {
        options.textString = nextString;
        startLetters();

      // string isn't ready yet, check again in a second
      } else {
        setTimeout(resetBlocks, 1000);
      }

    // reversing
    } else {

      // only start reversing if the next message is ready
      if (!requestingNextString) {
        blocks.reverse();
        for (var count = blocks.length - 1; count >= 0; count--){ blocks[count].opacity = 0;}
        currentBlock = 0;
        reversing = !reversing;
        setTimeout(function(){
          drawInterval = setInterval(draw, options.speed);
        }, 5000);

      // string isn't ready yet, check again in a second
      } else {
        setTimeout(resetBlocks, 1000);
      }
    }
  },



  /*
   * Retrieve next message
   */
  retrieveNextMessage = function() {
    var values = "method=getNext";
    requestingNextString = true;
    nextString = "";
    ajax.init({
      ajaxUrl: options.ajaxUrl,
      values: values,
      callback: retrieveNextMessageCallback
    });
  },


  /*
   * Retrieve next message, clean and cache
   */
  retrieveNextMessageCallback = function(data) {
    var messageData = json_parse(data);

    // if a message is set
    if (!!messageData.name) {
      nextString = messageData.message + "§§- "+messageData.name+", "+messageData.time_added;
      nextString = nextString.replace("\\'", "'");
      nextString = nextString.replace("\\\'", "'");
      nextString = nextString.replace('\\"', '"');
      nextString = nextString.replace('\\\"', '"');
      requestingNextString = false;

    // no new messages, wait
    } else {
      setTimeout(function(){
        retrieveNextMessage();
      }, 5000);
    }
  },


  /*
   * Turn Hex into RGB, for block colour
   */
  HexToRGB = function(h) {return HexToR(h) +","+HexToG(h)+","+HexToB(h);},
  HexToR = function(h) {return parseInt((cutHex(h)).substring(0,2),16);},
  HexToG = function(h) {return parseInt((cutHex(h)).substring(2,4),16);},
  HexToB = function(h) {return parseInt((cutHex(h)).substring(4,6),16);},
  cutHex = function(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h;},


  /*
   * Debug
   * output debug messages
   *
   * @return void
   * @private
   */
  debug = function(content) {
    if (!!options.debugMode) {
      console.log(content);
      clearTimeout(debugTimeout);
      debugTimeout = setTimeout(debugSpacer, 2000);
    }
  },
  debugSpacer = function() {
    if (!!options.debugMode) {
      console.log("----------------------------------------------------------------------------------");
    }
  };



  /*
   * expose public methods
   */
  return {
    init: init
  };
};