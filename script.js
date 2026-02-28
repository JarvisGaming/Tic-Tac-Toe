const GameController = function(){
    const boardSize = 9;

    function Player(mark){
        if (!new.target) throw new Error("Player constructor must be called with 'new'");
        this.mark = mark;
    }

    const player1 = new Player("X");
    const player2 = new Player("O");
    let currentPlayer = player1;

    const GameBoard = function(){
        const emptyCellSymbol = "";
        const state = new Array(boardSize).fill(emptyCellSymbol);

        function isEmpty(position){
            return state[position] == emptyCellSymbol;
        }

        function getMark(position){
            if (position < 0 || position >= boardSize) throw new Error(`Invalid cell position: ${position}`);
            return state[position];
        }

        // Returns true if the mark is successfully placed, false otherwise.
        function setMark(position, mark){
            if (position < 0 || position >= boardSize) throw new Error(`Invalid cell position: ${position}`);
            if (!isEmpty(position)) return false;

            state[position] = mark;
            return true;
        }

        function isFull(){
            return state.every(mark => mark != emptyCellSymbol);
        }

        // Returns the winning player. Returns null if it's a tie, or if the game hasn't ended yet.
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
                const [mark1, mark2, mark3] = [state[pos1], state[pos2], state[pos3]];

                if (isMarksEqual(mark1, mark2, mark3, player1.mark)) return player1;
                else if (isMarksEqual(mark1, mark2, mark3, player2.mark)) return player2;
            }

            return null;
        }

        return {
            getMark,
            setMark,
            isFull,
            getWinner,
        };
    }();

    const GameDisplay = function(){
        const boardElement = document.getElementById("grid");
        const cellTemplate = document.querySelector("template");
        const item = cellTemplate.content.querySelector(".cell");
    
        function initBoard(){
            for (let i = 0; i < boardSize; i++){
                const cellNode = document.importNode(item, true);
                cellNode.addEventListener("click", handleCellClick);
                boardElement.appendChild(cellNode);
            }
        }
    
        function updateCell(position, mark){
            const cell = boardElement.children[position];
            cell.textContent = mark;
        }

        function displayWinner(winner){
            const winnerDisplay = document.getElementById("winner");
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
        }

        function disableBoardInteraction(){
            for (const cell of boardElement.children){
                cell.removeEventListener("click", handleCellClick);
            }
        }
        
        return { 
            initBoard,
            updateCell,
            displayWinner,
            disableBoardInteraction,
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

        if(GameBoard.setMark(cellIndex, mark)){
            GameDisplay.updateCell(cellIndex, mark);
            changePlayer();

            if (GameBoard.getWinner() != null || GameBoard.isFull()){
                endGame();
            }
        }
    }

    function initGame(){
        GameDisplay.initBoard();
    }

    function endGame(){
        GameDisplay.displayWinner(GameBoard.getWinner());
        GameDisplay.disableBoardInteraction();
    }

    return {initGame};
}();

GameController.initGame();