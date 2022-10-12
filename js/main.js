'use strict'

// Pieces Types
const PAWN_BLACK = '♟'
const ROOK_BLACK = '♜'
const KNIGHT_BLACK = '♞'
const BISHOP_BLACK = '♝'
const QUEEN_BLACK = '♛'
const KING_BLACK = '♚'
const PAWN_WHITE = '♙'
const ROOK_WHITE = '♖'
const KNIGHT_WHITE = '♘'
const BISHOP_WHITE = '♗'
const QUEEN_WHITE = '♕'
const KING_WHITE = '♔'

// The Chess Board
var gBoard
var gSelectedElCell = null
var gWhiteTurn = true
function onRestartGame() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    document.querySelector(".whiteScore").innerText = ''
    document.querySelector(".blackScore").innerText = ''
}

function buildBoard() {
    // build the board 8 * 8
    var board = []
    for (var i = 0; i < 8; i++) {
        board[i] = []
        for (var j = 0; j < 8; j++) {
            board[i][j] = ''
            if (i === 1) board[i][j] = PAWN_BLACK
            else if (i === 6) board[i][j] = PAWN_WHITE
        }
    }

    board[0][0] = board[0][7] = ROOK_BLACK
    board[0][1] = board[0][6] = KNIGHT_BLACK
    board[0][2] = board[0][5] = BISHOP_BLACK
    board[0][3] = QUEEN_BLACK
    board[0][4] = KING_BLACK

    board[7][0] = board[7][7] = ROOK_WHITE
    board[7][1] = board[7][6] = KNIGHT_WHITE
    board[7][2] = board[7][5] = BISHOP_WHITE
    board[7][3] = QUEEN_WHITE
    board[7][4] = KING_WHITE

    // console.table(board)
    console.log(board)
    return board

}

function renderBoard(board) {
    var strHtml = ''
    for (var i = 0; i < board.length; i++) {
        var row = board[i]
        strHtml += '<tr>'
        for (var j = 0; j < row.length; j++) {
            var cell = row[j]
            // figure class name
            var className = ((i + j) % 2 === 0) ? 'white' : 'black'
            var tdId = `cell-${i}-${j}`
            strHtml += `<td id="${tdId}" onclick="cellClicked(this)"
            class="${className}">${cell}</td>`
        }
        strHtml += '</tr>'
    }
    var elMat = document.querySelector('.game-board')
    elMat.innerHTML = strHtml
}

function cellClicked(elCell) {
    // console.log('elCell', elCell)
    // console.log('gSelectedElCell', gSelectedElCell)
    // console.log('elCell.id', elCell.id)
    // if the target is marked - move the piece!
    if (elCell.classList.contains('mark')) {
        movePiece(gSelectedElCell, elCell)
        cleanBoard()
        return
    }

    cleanBoard()

    elCell.classList.add('selected')
    gSelectedElCell = elCell

    // console.log('elCell.id: ', elCell.id)
    var cellCoord = getCellCoord(elCell.id)
    // console.log('cellCoord', cellCoord)
    var piece = gBoard[cellCoord.i][cellCoord.j]
    // console.log('piece', piece)
    if (piece && gWhiteTurn !== isWhite(cellCoord)) {

        return
    }
    //alert(gWhiteTurn)


    var possibleCoords = []
    switch (piece) {
        case ROOK_BLACK:
        case ROOK_WHITE:
            possibleCoords = getAllPossibleCoordsRook(cellCoord)
            break
        case BISHOP_BLACK:
        case BISHOP_WHITE:
            possibleCoords = getAllPossibleCoordsBishop(cellCoord)
            break
        case KNIGHT_BLACK:
        case KNIGHT_WHITE:
            possibleCoords = getAllPossibleCoordsKnight(cellCoord)
            break
        case PAWN_BLACK:
        case PAWN_WHITE:
            possibleCoords = getAllPossibleCoordsPawn(cellCoord, piece === PAWN_WHITE)
            break
        case KING_BLACK:
        case KING_WHITE:
            possibleCoords = getAllPossibleCoordsKing(cellCoord,)
            break
        case QUEEN_BLACK:
        case QUEEN_WHITE:
            possibleCoords = getAllPossibleCoordsQueen(cellCoord)
            break

    }
    markCells(possibleCoords)
}

function movePiece(elFromCell, elToCell) {
    // console.log('elFromCell', elFromCell)
    // console.log('elToCell', elToCell)
    // use: getCellCoord to get the coords, move the piece
    var fromCoord = getCellCoord(elFromCell.id)
    var toCoord = getCellCoord(elToCell.id)
    // console.log('fromCoord', fromCoord)
    // console.log('toCoord', toCoord)
    // update the MODEl
    if (gBoard[toCoord.i][toCoord.j]) {
        if (isWhite(toCoord)) {
            console.log(toCoord);
            document.querySelector(".whiteScore").innerText += gBoard[toCoord.i][toCoord.j]
        } else {
            document.querySelector(".blackScore").innerText += gBoard[toCoord.i][toCoord.j]
        }
    }
    
   
    var piece = gBoard[fromCoord.i][fromCoord.j]
    if(isWhite(fromCoord) && toCoord.i === 0 && piece === PAWN_WHITE){
        piece = QUEEN_WHITE
    } else if(!isWhite(toCoord) && toCoord.i === 7 && piece === PAWN_BLACK){
        piece = BLACK_WHITE
    }
    gBoard[toCoord.i][toCoord.j] = piece

    gBoard[fromCoord.i][fromCoord.j] = ''

    // update the DOM
    elToCell.innerText = piece
    elFromCell.innerText = ''

    //turn on turns

    gWhiteTurn = !gWhiteTurn
    if (gWhiteTurn) document.querySelector('.turn').innerText = 'White Turn'
    else document.querySelector('.turn').innerText = 'Black Turn'


}

function markCells(coords) {
    // console.log('coords', coords)
    // query select them one by one and add mark 
    for (var i = 0; i < coords.length; i++) {
        var coord = coords[i] // {i: 5, j: 2}
        // console.log('coord', coord)
        var selector = getSelector(coord) // #cell-5-2
        // console.log('selector', selector)
        var elCell = document.querySelector(selector)
        // console.log('elCell', elCell)
        elCell.classList.add('mark')
    }
}

// Gets a string such as: 'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
    var coord = {}
    var parts = strCellId.split('-') // ['cell' , '2' , '7']
    coord.i = +parts[1] // 2
    coord.j = +parts[2] // 7
    return coord // {i:2, j:7}
}

function cleanBoard() {
    var elTds = document.querySelectorAll('.mark, .selected')
    for (var i = 0; i < elTds.length; i++) {
        elTds[i].classList.remove('mark', 'selected')
    }
}

function getSelector(coord) {
    return `#cell-${coord.i}-${coord.j}`
}

function isEmptyCell(coord) {
    return !gBoard[coord.i][coord.j]
}

function getAllPossibleCoordsPawn(pieceCoord, isPawnWhite) {
    // console.log('pieceCoord', pieceCoord)
    // console.log('isWhite', isWhite)
    var res = []
    // handle PAWN find the nextCoord use isEmptyCell()
    var diff = isPawnWhite ? -1 : 1
    var nextCoord = { i: pieceCoord.i + diff, j: pieceCoord.j }
    var possibleEat = { i: pieceCoord.i + diff, j: pieceCoord.j - diff }
    if (nextCoord.i < 0 || nextCoord.i > 7 || nextCoord.j < 0 || nextCoord.j > 7) return
    if (possibleEat.i >= 0 && possibleEat.i < 8 && possibleEat.j >= 0 && possibleEat.j < 8) {
        if (!isEmptyCell(possibleEat) && isWhite(pieceCoord) !== isWhite(possibleEat)) {
            res.push(possibleEat)
        }
        possibleEat = { i: pieceCoord.i + diff, j: pieceCoord.j + diff }
        if (!isEmptyCell(possibleEat) && isWhite(pieceCoord) !== isWhite(possibleEat)) {
            res.push(possibleEat)
        }
    }

    if (isEmptyCell(nextCoord)) res.push(nextCoord)
    else return res

    if (pieceCoord.i === 1 && !isPawnWhite || pieceCoord.i === 6 && isPawnWhite) {
        diff *= 2
        nextCoord = { i: pieceCoord.i + diff, j: pieceCoord.j }
        if (isEmptyCell(nextCoord)) res.push(nextCoord)
    }


    return res
}



function getAllPossibleCoordsRook(pieceCoord) {
    var res = []
    console.log(gBoard);
    for (var j = pieceCoord.j + 1; j < 8; j++) {
        var coord = { i: pieceCoord.i, j: j }
        if (!isEmptyCell(coord)) {
            if (isWhite(pieceCoord) !== isWhite(coord)) {
                res.push(coord)
            }
            break
        }
        res.push(coord)
    }
    for (var i = pieceCoord.i + 1; i < 8; i++) {
        var coord = { i: i, j: pieceCoord.j }
        if (!isEmptyCell(coord)) {
            if (isWhite(pieceCoord) !== isWhite(coord)) {
                res.push(coord)
            }
            break
        }
        res.push(coord)
    }
    for (var i = pieceCoord.i - 1; i >= 0; i--) {
        var coord = { i: i, j: pieceCoord.j }
        if (!isEmptyCell(coord)) {
            if (isWhite(pieceCoord) !== isWhite(coord)) {
                res.push(coord)
            }
            break
        }
        res.push(coord)
    }
    for (var j = pieceCoord.j - 1; j >= 0; j--) {
        var coord = { i: pieceCoord.i, j: j }
        if (!isEmptyCell(coord)) {
            if (isWhite(pieceCoord) !== isWhite(coord)) {
                res.push(coord)
            }
            break
        }
        res.push(coord)
    }
    return res
}

function getAllPossibleCoordsBishop(pieceCoord) {
    var res = []
    var i = pieceCoord.i - 1
    for (var idx = pieceCoord.j + 1; i >= 0 && idx < 8; idx++) {
        var coord = { i: i--, j: idx }
        if (!isEmptyCell(coord)) {
            if (isWhite(pieceCoord) !== isWhite(coord)) {
                res.push(coord)
            }
            break
        }
        res.push(coord)
    }
    var i = pieceCoord.i - 1
    for (var idx = pieceCoord.j - 1; i >= 0 && idx >= 0; idx--) {
        var coord = { i: i--, j: idx }
        if (!isEmptyCell(coord)) {
            if (isWhite(pieceCoord) !== isWhite(coord)) {
                res.push(coord)
            }
            break
        }
        res.push(coord)
    }
    var i = pieceCoord.i + 1
    for (var idx = pieceCoord.j + 1; i < 8 && idx < 8; idx++) {
        var coord = { i: i++, j: idx }
        if (!isEmptyCell(coord)) {
            if (isWhite(pieceCoord) !== isWhite(coord)) {
                res.push(coord)
            }
            break
        }
        res.push(coord)
    }
    var i = pieceCoord.i + 1
    for (var idx = pieceCoord.j - 1; i < 8 && idx >= 0; idx--) {
        var coord = { i: i++, j: idx }
        if (!isEmptyCell(coord)) {
            if (isWhite(pieceCoord) !== isWhite(coord)) {
                res.push(coord)
            }
            break
        }
        res.push(coord)
    }

    return res
}

function getAllPossibleCoordsKing(pieceCoord) {
    var res = []
    for (var i = pieceCoord.i - 1; i <= pieceCoord.i + 1; i++) {
        if (i < 0 || i > 7) continue;
        for (var j = pieceCoord.j - 1; j <= pieceCoord.j + 1; j++) {
            if (i === pieceCoord.i && j === pieceCoord.j || (j < 0 || j > 7)) continue
            var coord = { i: i, j: j }
            if (!isEmptyCell(coord)) {
                if (isWhite(pieceCoord) !== isWhite(coord)) {
                    res.push(coord)
                }
                continue
            }
            res.push(coord)
        }
    }

    return res
}

function getAllPossibleCoordsQueen(pieceCoord) {
    var arr1 = getAllPossibleCoordsBishop(pieceCoord)
    var arr2 = getAllPossibleCoordsRook(pieceCoord)
    var res = arr1.concat(arr2)
    return res
}


function getAllPossibleCoordsKnight(pieceCoord) {
    var res = []
    var combinationsArr = [-1, -2, 1, 2]
    for (var i = 0; i < combinationsArr.length; i++) {
        for (var j = 0; j < combinationsArr.length; j++) {
            if (i === j || Math.abs(combinationsArr[i]) + Math.abs(combinationsArr[j]) !== 3) continue
            var coord = { i: pieceCoord.i + combinationsArr[i], j: pieceCoord.j + combinationsArr[j] }
            if (coord.i > 7 || coord.i < 0 || coord.j > 7 || coord.j < 0) continue
            if (isEmptyCell(coord)) res.push(coord)
            else if (isWhite(pieceCoord) !== isWhite(coord)) res.push(coord)
        }
    }
    return res
}


function isWhite(coord) {
    var whiteToolsArr = [PAWN_WHITE, ROOK_WHITE, KNIGHT_WHITE, BISHOP_WHITE, QUEEN_WHITE, KING_WHITE]
    var isPieceWhite = whiteToolsArr.includes(gBoard[coord.i][coord.j])

    return isPieceWhite

}


