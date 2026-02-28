const TicTacToe = function(){
    const Symbol = {
        X: "X",
        O: "O",
        Empty: " ",
    };

    const GameBoard = function(){
        const state = new Array.length(9).fill(Symbol.Empty);

        function isEmpty(position){
            return state[position] == Symbol.Empty;
        }

        function set(position, mark){
            state[position] = mark;
        }

        return {
            isEmpty,
            set,
        };
    }();
}();