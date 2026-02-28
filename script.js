const TicTacToe = function(){
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

    const GameBoard = function(){
        const boardSize = 9;
        const state = new Array(boardSize).fill(Symbol.Empty);

        function isEmpty(position){
            return state[position] == Symbol.Empty;
        }

        // Returns true if the mark is successfully placed, false otherwise.
        function set(position, mark){
            if (!isEmpty(position)) return false;
            state[position] = mark;
            return true;
        }

        function display(){
            const rowSeparator = "+-+-+-+\n";
            function buildRow(mark1, mark2, mark3){
                return `|${mark1}|${mark2}|${mark3}|\n`;
            }

            let output = "";
            for (let i = 0; i <= 6; i += 3){
                output += rowSeparator;
                output += buildRow(state[i], state[i+1], state[i+2]);
            }
            output += rowSeparator;
            console.log(output);
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
            set,
            display,
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

    function playRound(){
        const mark = getCurrentPlayerMark();

        let position;
        do {
            position = parseInt(prompt("Enter position:"));
        } while (!GameBoard.set(position, mark));

        GameBoard.display();
        changePlayer();
    }

    function playGame(){
        while (GameBoard.getWinner() == Winner.Undetermined) {
            playRound();
        }
        console.log(GameBoard.getWinner());
    }

    return {playGame};
}();

TicTacToe.playGame();