import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkGame, autoFillInput, isGameEnd, gameWon, mobileKeyboardPress } from '../features/tableSlice.js';
import { startWatch, resetWatch } from '../features/stopwatchSlice.js';
import { displayOverlayMessage, displayWinMessage, displayNotCorrect } from '../features/messageSlice.js';


import './CompStyle.css';
// import TableLineStyling from './TableLineStyling.js';

export default function GameCalc() {
    const dispatch = useDispatch();
    const fullTableShow = useSelector((state) => state.table.showValue);
    const numberToShow = useSelector((state) => state.table.gameDiff);
    const checkUserInput = useSelector((state) => state.table.checkGame);
    const autoInput = useSelector((state) => state.table.fill);
    const isEasyMode = useSelector((state) => state.table.easyMode);
    const isMobile = useSelector((state) => state.mobile.isMobile);
    const keyPress = useSelector((state) => state.table.mobileKeyPress);

    const [gameTable, setGameTable] = useState([]);             // game table to be filled
    const [userInput, setUserInput] = useState([]);             // users input log
    const [showArr,setShowArr]  = useState([]);                 // array of display

    let checkNumbers = [1,2,3,4,5,6,7,8,9];                     // global var for row check
    let temp_table = [[],[],[],[],[],[],[],[],[]];              // global var for table check
    let looperCounter = 0;                                      // global var for checking infinity
    let boxArr = [[],[],[]];                                    // global var for boxing 
    let showNumArr = [];                                        // global var for array of display 
    let zeroCount = 0;                                          // global var for zeroing
    let uInput = [[],[],[],[],[],[],[],[],[]];                  // user input table

    // start game 
    useEffect(() => {
        if ( numberToShow !== undefined ) {
            // run the game with selected difficulty
            gameDiff(numberToShow);
            // clear the game table 
            cleanTable();
            // reset the watch
            dispatch(resetWatch());
        } 
    
    }, [numberToShow]);

    // player pressed submit ---- >>>> check users input
    useEffect(() => {
        if ( checkUserInput ) {
            // stop timer 
            dispatch(startWatch(false));

            // call check users input table
            inputVSGame();
            dispatch(checkGame(false));
        }
    }, [checkUserInput]);

    //  compare game board to users input
    //  !!! add check for different combinations that work... !!! 
    const inputVSGame = () => {
        let counter = 0;
        gameTable.forEach((row,rowI) => {row.forEach((cell, cellI) => {
                if ( gameTable[rowI][cellI] === userInput[rowI][cellI] ) {
                    return (
                        // count correct cells 
                        counter++
                    )
                };
            

        })});
        // if all cells filled correctly - end game else 
        counter === 81 ? finishGame() : continueGame();
    };
    // player complited the game!
    const finishGame = () => {
        dispatch(gameWon(true));
        dispatch(displayOverlayMessage(true));
        dispatch(displayWinMessage(true));

    };
    // player didn't complete game correctly .. continue game
    const continueGame = () => {
        dispatch(displayOverlayMessage(true));
        dispatch(displayNotCorrect(true));
       
    };
    
    // add users mobile keyboard press
    useEffect(() => {
    //   locate active cell 
        if ( keyPress !== 0 ) {
            let activeCell = document.querySelector('.active');
            let uInputLocael = [];
            if ( activeCell !== null ) {
                uInputLocael = userInput;
                if ( activeCell.classList[1] === 'mobileInPut' ) { 
                    uInputLocael[activeCell.classList[0] - 1][activeCell.classList[0] -1] = keyPress;
                }
                else {
                    uInputLocael[activeCell.classList[0] - 1][activeCell.classList[1] - 1] = keyPress;
                }
            }
            // add number
            setUserInput(uInput => [...uInput]);
            // run a check to see if any empty cells
            checkEveryInput();
            dispatch(mobileKeyboardPress(0)); 
        }
    }, [keyPress]);

    // player pressed auto fill input
    useEffect(() => {
        if ( autoInput ) {
            autoFill();
            dispatch(isGameEnd(true));
            dispatch(autoFillInput(false));
        }
    }, [autoInput]);

    // auto fill input table - second time will fill correctly
    const autoFill = () => {
        let local = [[],[],[],[],[],[],[],[],[]];
        userInput.forEach((row, rowI) => row.forEach((cell, cellI) => {
            if ( userInput[rowI][cellI] === 0 ) {       // second time will fill table correctly (=
                local[rowI][cellI] = 1;
            }
            else {
                local[rowI][cellI] = gameTable[rowI][cellI];
            }
        }))
        setUserInput(local);
    };

    const checkEveryInput = () => {
        // here need to get user input and cell number 
        // if ( isEasyMode ) {
        //     gameTable.map((row,rowI) => {row.map((cell, cellI) => {
        //         if ( gameTable[rowI][cellI] === userInput[rowI][cellI] ) {
        //             return (
        //                 console.log('Lol')
        //             )
        //         }
    
        //     })});
            
        // }
        // else { 
            let counter = 0;
            userInput.forEach((row,rowI) => {row.forEach((cell, cellI) => {
                if ( cell === 0 ) {
                        counter++
                }
            })});
        // if no emptey cells open submit option
            if ( counter === 0 ) { dispatch(isGameEnd(true)) };  
        // }
        
    };
    
    // create full game table
    const cleanTable = () => {
        let newTable = [[],[],[],[],[],[],[],[],[]];
        // let counter = 0;
        for(let i=0; i<9; i++) {
            checkNumbers = [1,2,3,4,5,6,7,8,9];
            looperCounter = 0;
            for(let j=0; j<9; j++) {
                let newCell = Math.floor((Math.random() * 9) + 1);
                if ( insertChecker (j, i, newCell, newTable) === true ) {
                    fillBox(j,i,newCell);
                    newTable[i][j] = newCell;
                    temp_table = newTable;
                    looperCounter = 0;
                    newCell = 0;
                }
                else {
                    j--;
                }
                    if ( looperCounter > 1500 ) {
                        i = zerOut(i);
                        looperCounter = 0;
                        break;
                    } 
            }          
        }
        setGameTable(newTable);
        looperFunc(newTable);

    };

    // set game difficulty ---- how many to show on screen 
    // change the game difficulty
    const gameDiff = (xxx) => {        
        let ranRow, ranCol = 0;
        // let local = ''; 
        let arr = [];
        // let b = [];
        for ( let i=0;i<xxx;i++ ) {
            ranRow = Math.floor((Math.random() * 9) + 1) - 1;
            ranCol = Math.floor((Math.random() * 9) + 1) - 1;
            let local = `${ranRow}${ranCol}`;
            let b = (arr.filter((xxx) => xxx === local));
            arr.push(local);
            if ( b === local ) {
                arr.pop();
                i--;
            }
        }
        showNumArr = arr;
        setShowArr(arr);

    };

    // fill 3*3 box
    const fillBox = (col, row , cell) => {
        if ( ((row === 3 && boxArr[2].length === 9) || (row === 6 && boxArr[2].length === 9)) ) {
            boxArr = [[],[],[]];
        }
        if ( row < 3 ) {
            if ( col < 3 ) {
                boxArr[0].push(cell);
            }
            if ( col > 2 && col < 6 ) {
                boxArr[1].push(cell);
            }
            if ( col > 5 ) {
                boxArr[2].push(cell);
            }
        }
        else if ( row > 2 && row < 6 ) {
            if ( col < 3 ) {
                boxArr[0].push(cell);
            }
            if ( col > 2 && col < 6 ) {
                boxArr[1].push(cell);
            }
            if ( col > 5 ) {
                boxArr[2].push(cell);
            }
        }
        else if ( row > 5 ) {
            if ( col < 3 ) {
                boxArr[0].push(cell);
            }
            if ( col > 2 && col < 6 ) {
                boxArr[1].push(cell);
            }
            if ( col > 5 ) {
                boxArr[2].push(cell);
            }
        }
    };

    // start of insertion into game table 
    const insertChecker = (row, col, cell, table) => {                          
        if ( rowPosChecker(row, col, cell, table) === true ) {                   // check if cell can be placed row
            if ( colPosChecker(row, col, cell, table) === true) {                // check if cell can be placed col
                if ( boxPosChecker(row, col, cell, table) === true ) {           // check if cell can be placed 3*3
                    return true;        
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    // check if cell can be placed in row
    const rowPosChecker = (row, col, cell, table) => {
        if( checkNumbers[cell-1] === cell ) {
            checkNumbers[cell-1] = 0;
            return true;
        }
        else {
            return false;
        }
    };

    // check if cell can be placed in col
    const colPosChecker = (col, row, cell, table) => {
        let counter = 0;
        if( row === 0 ) { 
            return true;
        }
        for (let i=0; i<row; i++) {
            if ( table[i][col] !== cell ) {
                counter++;
            }
        }
        if ( counter === row) {
            return true;
        }
        else {
            checkNumbers[cell-1] = cell;
            looperCounter++;
            return false;
        } 
    };

    // check if cell can be placed in 3*3 box
    const boxPosChecker = (col, row, cell, table) => {
        let arr = [];
        if ( row === 0 || row === 3 || row === 6 ) {
            return true;
        }
        if ( (row < 3 && col < 3) || (row > 2 && row < 6 && col < 3) || (row > 5 && col < 3) ) { // only first 3 col box row 0-2 
            arr = boxArr[0].filter((e,i) => e === cell);
            if ( arr.length === 0 ) {
                return true;
            }
            else {
                checkNumbers[cell-1] = cell;
                looperCounter++;
                return false;
            }
        }
        if ( (row < 3 && col > 2 && col < 6) || (row > 2 && row < 6 && col > 2 && col < 6) || (row > 5 && col > 2 && col < 6) ) {
            arr = boxArr[1].filter((e,i) => e === cell);
            if ( arr.length === 0 ) {
                return true;
            }
            else {
                checkNumbers[cell-1] = cell;
                looperCounter++;
                return false;
            }
        }   
        if ( (row < 3 && col > 5) || (row > 2 && row < 6 && col > 5) || (row > 5 && col > 5) ) {
            arr = boxArr[2].filter((e,i) => e === cell);
            if ( arr.length === 0 ) {
                return true;
            }
            else {
                checkNumbers[cell-1] = cell;
                looperCounter++;
                return false;
            }
        }

    };

    // clean wrong placments
    const zerOut = (row) => {
        zeroCount++;
        if ( row < 3 ) {
            // temp_table[0] = [];
            temp_table[1] = [];
            temp_table[2] = [];
            boxArr = [temp_table[0].filter((e,i) => i < 3), temp_table[0].filter((e,i) => i > 2 && i < 6), temp_table[0].filter((e,i) => i > 5)];
            checkNumbers = [1,2,3,4,5,6,7,8,9];
            return row = 0;
        }
        if ( row > 2 && row < 6 ) {
            temp_table[3] = [];
            temp_table[4] = [];
            temp_table[5] = [];
            boxArr = [[],[],[]];
            // boxArr = [temp_table[3].filter((e,i) => i < 3), temp_table[3].filter((e,i) => i > 2 && i < 6), temp_table[3].filter((e,i) => i > 5)];
            checkNumbers = [1,2,3,4,5,6,7,8,9];
            return row = 2;
        }
        if ( row > 5 ) {
            temp_table[6] = [];
            temp_table[7] = [];
            temp_table[8] = [];
            // boxArr = [temp_table[6].filter((e,i) => i < 3), temp_table[6].filter((e,i) => i > 2 && i < 6), temp_table[6].filter((e,i) => i > 5)];
            boxArr = [[],[],[]];
            checkNumbers = [1,2,3,4,5,6,7,8,9];
            return row = 5;
        }

    };

    // fill player input table 
    const looperFunc = () => {
        let table = temp_table;
        let arr = showNumArr;
        for(let x=0; x<9; x++) {
            for(let y=0;y<9;y++) {
                // temp_table[x][y] = ' ';  
                let int = arr.filter((rando) => parseInt(rando.slice(0, 1)) === x && parseInt(rando.slice(1, 2)) === y);    // check if displayed on screen
                if ( int.length !== 0 ) {
                    uInput[x][y] = table[x][y];                                                                             // if true input table add the cell value
                    
                }
                else {
                    uInput[x][y] = 0                                                                                        // else just add 0 in the cell
                }
            }
        }
        setUserInput(uInput);

    };

    // print a full table on screen
    const tableBase = () => {
        return (
            <div className='gameTableStyle'>
                    { gameTable.map((row,i) => {
                        return (
                            <div className={`rows row_${ i+1 }`} key={ `tr_${row + i}` } >
                                { row.map((element,z) => {
                                    return (
                                        <div key={ `td_${row  + z}` } className={ `cells cell_${i}${z} r${i} c${z}` }>    
                                                { (showArr.filter((xxx) => xxx === `${i}${z}`) === `${i}${z}`)
                                                ?  <div className='elementDiv'>{ element }</div>  
                                                : !isMobile ? <input    
                                                        className={ `${i}${z} inputStyle` }  
                                                        value={ parseInt(userInput[i][z]) === 0 ? '' : parseInt(userInput[i][z]) } 
                                                        type= 'text' 
                                                        onChange={ (e) => maxLengthInput(e) }
                                                        onKeyDown = { (e) => delCell(e) }
                                                        style={{ color: easyColorSelector(i, z) }}
                                                    /> 
                                                            : <div className={`${i+1} ${z+1} mobileInPut`} onClick={ (e) => setMobileCellActive(e) } style={{ color: easyColorSelector(i, z) }}>
                                                                { parseInt(userInput[i][z]) === 0 ? '' : parseInt(userInput[i][z]) }
                                                            </div>
                                                }            
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
            </div> 
        )
    };

    // for the light players =)
    const easyColorSelector = (i, z) => { 
        if ( !isMobile ) {
            if (isEasyMode && parseInt(userInput[i][z]) !== gameTable[i][z]) {
                return 'red'
            } else { return 'black' };
        }         
        else {
            if (isEasyMode && parseInt(userInput[i][z]) !== gameTable[i][z]) {
                return 'black'
            } else { return 'red' };
        }                 
        
    };

    // inspect users input and place in check table
    const maxLengthInput = (e) => {
        uInput = userInput;
        let numbers = /[1-9]/;
        let i = parseInt(e.target.className.slice(0, 1));
        let j = parseInt(e.target.className.slice(1, 2));
        let user = e.target.value.slice(0, 1);
        if ( user.match(numbers) !== null ) {
            uInput[i][j] = parseInt(user);
            setUserInput(uInput => [...uInput]);                   // !!!! this is how you update an array hook MF !!!!
            if ( fullTableShow ) { checkEveryInput(); }
        }
        else {
            console.log('Not a Number');
        }
        // newArr.map((row,rowI) => row.map((col,colI) => { return newArr[i][j] = parseInt(user) } ));
        // arr[i][j] = parseInt(user);

    };

    // delete cell using backspace or delete buttons
    const delCell = (e) => {
        let keyInput = e.key;
        uInput = userInput;
        let i = parseInt(e.target.className.slice(0, 1));
        let j = parseInt(e.target.className.slice(1, 2));
        if (keyInput === 'Delete' || keyInput === 'Backspace') {
            uInput[i][j] = 0;
            setUserInput(uInput => [...uInput]);
        }
    };

    // activte mobile cell 
    const setMobileCellActive = (event) => {
        // let one = event.target.classList[0];
        // let two = event.target.classList[1];
        uInput = userInput;

        let activeCell = document.querySelector('.active');
        if ( activeCell !== null ) {
            activeCell.classList.remove('active');
        };
        event.target.classList.add('active');
    };

    // create empty table for before game start
    const emptyTable = () => {
        createEmptyTable();
    return (
        <div className='emptyTableStyle'>
                { temp_table.map((ele,i) =>{
                    return (
                        <div className={`rows row_${ i+1 }`} key={ `tr_${i}` } >             {/* if row 3 && 6 add top line  */}
                            { ele.map((el, ie) => {
                                return (
                                    <div className={`cells cell_${i+1}${ie+1}`} key={ `td_${ie}`}> {/* if col 3 && 6 add right line  */}
                                        {}
                                    </div>
                                )
                                
                            })}
                        </div>
                    )
                })}
        </div>
    )
};

// populate empty table
const createEmptyTable = () => {
    // let table = temp_table;
    // let arr = showNumArr;
    for(let x=0; x<9; x++) {
        for(let y=0;y<9;y++) {
            temp_table[x][y] = ' ';  
            
        }
    }
};

  return (
        fullTableShow ? tableBase() : emptyTable()
  )
};
