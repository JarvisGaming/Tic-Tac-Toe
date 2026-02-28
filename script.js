const GameController = function(){
    const boardSize = 9;

    const Symbol = {
        X: "X",
        O: "O",
        Empty: " ",
    };

    const Player = {
        X: "Player1",
        O: "Player2",
    };

    const Winner = {
        X: "Player1",
        O: "Player2",
        Tie: "Tie",
        Undetermined: "Undetermined",
    };

    let currentPlayer = Player.X;

    const GameBoard = function(){
        const state = new Array(boardSize).fill(Symbol.Empty);

        function isEmpty(position){
            return state[position] == Symbol.Empty;
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
            return state.every(mark => mark != Symbol.Empty);
        }

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

                if (isMarksEqual(mark1, mark2, mark3, Symbol.X)) return Winner.X;
                else if (isMarksEqual(mark1, mark2, mark3, Symbol.O)) return Winner.O;
            }

            if (isFull()) return Winner.Tie;
            else return Winner.Undetermined;
        }

        return {
            getMark,
            setMark,
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
                case Winner.X:
                    winnerMessage = "X wins!";
                    break;
                case Winner.O:
                    winnerMessage = "O wins!";
                    break;
                case Winner.Tie:
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
        if (currentPlayer == Player.X) currentPlayer = Player.O;
        else currentPlayer = Player.X;
    }

    function getCurrentPlayerMark(){
        if (currentPlayer == Player.X) return Symbol.X;
        else if (currentPlayer == Player.O) return Symbol.O;
        else throw new Error(`Invalid currentPlayer: ${currentPlayer}`);
    }

    function handleCellClick(event){
        const mark = getCurrentPlayerMark();
        const cell = event.target;
        const cellIndex = Array.prototype.indexOf.call(cell.parentNode.children, cell);

        if(GameBoard.setMark(cellIndex, mark)){
            GameDisplay.updateCell(cellIndex, mark);
            changePlayer();

            if (GameBoard.getWinner() != Winner.Undetermined){
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