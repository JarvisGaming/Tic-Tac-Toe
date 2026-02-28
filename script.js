const boardSize = 9;

const GameController = function(){
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

    const GameDisplay = function(){
        const board = document.getElementById("grid");
        const cellTemplate = document.querySelector("template");
        const item = cellTemplate.content.querySelector(".cell");
    
        function initBoard(){
            for (let i = 0; i < boardSize; i++){
                const cellNode = document.importNode(item, true);
                cellNode.addEventListener("click", playRound);
                board.appendChild(cellNode);
            }
        }
    
        function updateBoard(state){
            for (let i = 0; i < boardSize; i++){
                const cell = board.children[i];
                const mark = state[i];
                cell.textContent = mark;
            }
        }

        function disableBoardInteraction(){
            for (const cell of board.children){
                cell.removeEventListener("click", playRound);
            }
        }
        
        return { 
            initBoard,
            updateBoard,
            disableBoardInteraction,
        };
    }();

    const GameBoard = function(){
        const state = new Array(boardSize).fill(Symbol.Empty);

        function isEmpty(position){
            return state[position] == Symbol.Empty;
        }

        // Returns true if the mark is successfully placed, false otherwise.
        function set(position, mark){
            if (position < 0 || position >= boardSize) throw new Error(`Invalid cell position: ${position}`);
            if (!isEmpty(position)) return false;

            state[position] = mark;
            return true;
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

            if (state.filter(mark => mark != Symbol.Empty).length == boardSize) return Winner.Tie;
            else return Winner.Undetermined;
        }

        return {
            state,
            set,
            getWinner,
        };
    }();

    let currentPlayer = Player.X;

    function changePlayer(){
        if (currentPlayer == Player.X) currentPlayer = Player.O;
        else currentPlayer = Player.X;
    }

    function getCurrentPlayerMark(){
        if (currentPlayer == Player.X) return Symbol.X;
        else if (currentPlayer == Player.O) return Symbol.O;
        else throw new Error(`Invalid currentPlayer: ${currentPlayer}`);
    }

    function playRound(event){
        const mark = getCurrentPlayerMark();
        const cell = event.target;
        const cellIndex = Array.prototype.indexOf.call(cell.parentNode.children, cell);

        if(GameBoard.set(cellIndex, mark)){
            GameDisplay.updateBoard(GameBoard.state);
            changePlayer();
        }

        if (GameBoard.getWinner() != Winner.Undetermined){
            endGame(GameBoard.getWinner());
        }
    }

    function initGame(){
        GameDisplay.initBoard();
    }

    function endGame(winner){
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

        winnerDisplay.textContent = winnerMessage;
        GameDisplay.disableBoardInteraction();
    }

    return {initGame};
}();

GameController.initGame();