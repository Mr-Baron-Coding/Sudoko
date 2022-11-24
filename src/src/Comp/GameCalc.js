import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkGame, autoFillInput, superEasy, gameWon } from '../features/tableSlice.js';
import { startWatch, resetWatch } from '../features/stopwatchSlice.js';


import '../Style.css';

export default function GameCalc() {
    const dispatch = useDispatch();
    const fullTableShow = useSelector((state) => state.table.showValue);
    const numberToShow = useSelector((state) => state.table.gameDiff);
    const checkUserInput = useSelector((state) => state.table.checkGame);
    const autoInput = useSelector((state) => state.table.fill);
    const isEasyMode = useSelector((state) => state.table.easyMode);

    const [gameTable, setGameTable] = useState([]);             // game table to be filled
    const [userInput, setUserInput] = useState([]);             // users input log
    const [showArr,setShowArr]  = useState([]);                 // array of display
    const [runTime, setRunTime] = useState(false);

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
            gameDiff(numberToShow);
            cleanTable();
        } 
    
    }, [numberToShow]);

    // check users input 
    useEffect(() => {
        if ( checkUserInput === true ) {
            dispatch(startWatch(false));
            dispatch(resetWatch());
            inputVSGame();
            // dispatch(checkGame(false));
        }
        if ( isEasyMode && !checkUserInput ) {
            checkEveryInput();
        }
    }, [checkUserInput]);


    // auto fill the input
    useEffect(() => {
        if ( autoInput === true ) {
            autoFill();
            dispatch(autoFillInput(false));
        }
    }, [autoInput]);

    // auto fill input table - second time will fill correctly
    const autoFill = () => {
        let local = [[],[],[],[],[],[],[],[],[]];
        userInput.map((row, rowI) => row.map((cell, cellI) => {
            if ( userInput[rowI][cellI] === 0 ) {       // second time will fill table correctly (=
                local[rowI][cellI] = 1;
            }
            else {
                local[rowI][cellI] = gameTable[rowI][cellI]
            }
        }))
        setUserInput(local);
    };

    const checkEveryInput = () => {
        // here need to get user input and cell number 
        dispatch(superEasy(false));
        console.log('Still LOL');
    }

    //check user imput 
    const inputVSGame = () => {
        let counter = 0;
        gameTable.map((row,rowI) => {row.map((cell, cellI) => {
            if ( gameTable[rowI][cellI] === userInput[rowI][cellI] ) {
                return (
                    counter++
                )
            }

        })})
        counter === 81 ? dispatch(gameWon(true)) : console.log('Not yet');;
    }
    
    // create full game table
    const cleanTable = () => {
        let newTable = [[],[],[],[],[],[],[],[],[]];
        let counter = 0;
        for(let i=0; i<9; i++) {
            checkNumbers = [1,2,3,4,5,6,7,8,9];
            looperCounter = 0;
            for(let j=0; j<9; j++) {
                let newCell = Math.floor((Math.random() * 9) + 1);
                if ( insertChecker (j, i, newCell, newTable) == true ) {
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
        let local = ''; 
        let arr = [];
        for ( let i=0;i<xxx;i++ ) {
            ranRow = Math.floor((Math.random() * 9) + 1) - 1;
            ranCol = Math.floor((Math.random() * 9) + 1) - 1;
            local = `${ranRow}${ranCol}`;
            let b = (arr.filter((xxx) => xxx === local));
            arr.push(local);
            if ( b == local ) {
                arr.pop();
                i--;
            }
        }
        showNumArr = arr;
        setShowArr(arr);

    };

    // fill 3*3 box
    const fillBox = (col, row , cell) => {
        if ( (row === 3 && boxArr[2].length == 9 || row === 6 && boxArr[2].length == 9) ) {
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
    }

    // start of insertion into game table 
    const insertChecker = (row, col, cell, table) => {                          
        if ( rowPosChecker(row, col, cell, table) == true ) {                   // check if cell can be placed row
            if ( colPosChecker(row, col, cell, table) == true) {                // check if cell can be placed col
                if ( boxPosChecker(row, col, cell, table) == true ) {           // check if cell can be placed 3*3
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
        if( checkNumbers[cell-1] == cell ) {
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
        if ( row < 3 && col < 3 || row > 2 && row < 6 && col < 3 || row > 5 && col < 3 ) { // only first 3 col box row 0-2 
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
        if ( row < 3 && col > 2 && col < 6 || row > 2 && row < 6 && col > 2 && col < 6 || row > 5 && col > 2 && col < 6 ) {
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
        if ( row < 3 && col > 5 || row > 2 && row < 6 && col > 5 || row > 5 && col > 5 ) {
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
            <table>
                <tbody>
                    { gameTable.map((row,i) => {
                        return (
                            <tr key={ `tr_${row + i}` } >
                                { row.map((element,z) => {
                                    return (
                                        <td key={ `td_${row  + z}` } className={ `tr_${i}${z}` }>    
                                                { (showArr.filter((xxx) => xxx === `${i}${z}`) == `${i}${z}`)
                                                ?  element  
                                                : <input    
                                                        className={ `${i}${z}` }  
                                                        value={ parseInt(userInput[i][z]) === 0 ? '' : parseInt(userInput[i][z]) } 
                                                        type= 'text' 
                                                        onChange={ (e) => maxLengthInput(e) }
                                                        onKeyDown = { (e) => delCell(e) }
                                                        style={{ color: easyColorSelector(i, z) }}
                                                    /> 
                                                }            
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                                        
                </tbody>
            </table> 
        )
    };

    const easyColorSelector = (i, z) => {                           // for the light players =)
        if (isEasyMode && parseInt(userInput[i][z]) !== gameTable[i][z]) {
            return 'red'
        } else { return 'black' };
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
            console.log(keyInput);
            uInput[i][j] = 0;
            setUserInput(uInput => [...uInput]);
        }
    };

    // create empty table for before game start
    const emptyTable = () => {
        createEmptyTable();
    return (
        <table style={{ width: '30rem', height: '20rem' }}>
            <tbody>
                { temp_table.map((ele,i) =>{
                    return (
                        <tr key={ `tr_${i}` } className={ `tr_${i}` } style={{ width: '3rem', height: '3rem', border: '1px solid black' }}>             {/* if row 3 && 6 add top line  */}
                            { ele.map((el, ie) => {
                                return (
                                    <td key={ `td_${ie}`} className={ `tr_${i}` } style={{ width: '3rem', height: '3rem', border: '1px solid black' }}> {/* if col 3 && 6 add right line  */}
                                        {}
                                    </td>
                                )
                                
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
};

// populate empty table
const createEmptyTable = () => {
    let table = temp_table;
    let arr = showNumArr;
    for(let x=0; x<9; x++) {
        for(let y=0;y<9;y++) {
            temp_table[x][y] = ' ';  
            
        }
    }
};

  return (
    <div>
        { fullTableShow ? tableBase() : emptyTable() }
    </div>
  )
}
