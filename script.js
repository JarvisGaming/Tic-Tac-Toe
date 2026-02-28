const GameController = function(){
    const numCells = 9;

    function Player(mark){
        if (!new.target) throw new Error("Player constructor must be called with 'new'");
        this.mark = mark;
    }

    const player1 = new Player("X");
    const player2 = new Player("O");
    let currentPlayer = player1;

    const GameBoard = function(){
        const emptyCellSymbol = "";
        let state = new Array(numCells).fill(emptyCellSymbol);

        function isEmpty(position){
            return state[position] == emptyCellSymbol;
        }

        function getMark(position){
            if (position < 0 || position >= numCells) throw new Error(`Invalid cell position: ${position}`);
            return state[position];
        }

        /** Returns true if the mark is successfully placed, false otherwise. */
        function setMark(position, mark){
            if (position < 0 || position >= numCells) throw new Error(`Invalid cell position: ${position}`);
            if (!isEmpty(position)) return false;

            state[position] = mark;
            return true;
        }

        function isFull(){
            return state.every(mark => mark != emptyCellSymbol);
        }

        function clearBoard(){
            state = state.map(() => emptyCellSymbol);
        }

        return {
            getMark,
            setMark,
            isFull,
            clearBoard,
        };
    }();

    const GameDisplay = function(){
        const boardElement = document.getElementById("grid");
        const template = document.querySelector("template");
        const winnerDisplay = document.getElementById("winner");
        const cellTemplate = template.content.querySelector(".cell");
    
        function initBoard(){
            for (let i = 0; i < numCells; i++){
                const cellNode = document.importNode(cellTemplate, true);
                boardElement.appendChild(cellNode);
            }
            enableBoardInteraction();
        }
        
        function resetDisplay(){
            for (const cell of boardElement.children){
                cell.innerHTML = "";
            }
            winnerDisplay.textContent = "";
            enableBoardInteraction();
        }
    
        function updateCell(position, mark){
            const cell = boardElement.children[position];
            cell.textContent = mark;
        }

        function displayGameEnd(winner){
            let winnerMessage;

            switch (winner){
                case player1:
                    winnerMessage = "X wins!";
                    break;
                case player2:
                    winnerMessage = "O wins!";
                    break;
                case null:
                    winnerMessage = "It's a tie!";
                    break;
                default:
                    throw new Error(`Invalid winner: ${winner}`);
            }

            winnerDisplay.innerText = winnerMessage;

            disableBoardInteraction();
        }

        function enableBoardInteraction(){
            for (const cell of boardElement.children){
                cell.addEventListener("click", handleCellClick);
            }
        }

        function disableBoardInteraction(){
            for (const cell of boardElement.children){
                cell.removeEventListener("click", handleCellClick);
            }
        }
        
        return { 
            initBoard,
            resetDisplay,
            updateCell,
            displayGameEnd,
        };
    }();

    function changePlayer(){
        if (currentPlayer === player1) currentPlayer = player2;
        else currentPlayer = player1;
    }

    function handleCellClick(event){
        const mark = currentPlayer.mark;
        const cell = event.target;
        const cellIndex = Array.prototype.indexOf.call(cell.parentNode.children, cell);

        if (GameBoard.setMark(cellIndex, mark)){
            GameDisplay.updateCell(cellIndex, mark);
            changePlayer();

            if (getWinner() != null || GameBoard.isFull()){
                endGame();
            }
        }
    }

    /** Gets the winning player. Returns null if it's a tie, or if the game hasn't ended yet. */
    function getWinner(){
        const winningPaths = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        function isMarksEqual(mark1, mark2, mark3, target){
            return (mark1 == mark2) &&
                (mark2 == mark3) &&
                (mark3 == target);
        }

        for (const [pos1, pos2, pos3] of winningPaths){
            const [mark1, mark2, mark3] = [GameBoard.getMark(pos1), GameBoard.getMark(pos2), GameBoard.getMark(pos3)];

            if (isMarksEqual(mark1, mark2, mark3, player1.mark)) return player1;
            else if (isMarksEqual(mark1, mark2, mark3, player2.mark)) return player2;
        }

        return null;
    }

    function initGame(){
        GameDisplay.initBoard();
    }

    function endGame(){
        GameDisplay.displayGameEnd(getWinner());
    }

    function restartGame(){
        GameBoard.clearBoard();
        GameDisplay.resetDisplay();
        currentPlayer = player1;
    }

    return {
        initGame,
        restartGame,
    };
}();

GameController.initGame();

const restartButton = document.getElementById("restart-button");
restartButton.addEventListener("click", GameController.restartGame);