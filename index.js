const Gameboard = (function () {
    const board = [["", "", ""], ["", "", ""], ["", "", ""]];

    const getboard = () => board;
    const setboard = (row, col, val) => {
        if(board[row][col] != "") return;
        board[row][col] = val;
    }

    const reset = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = "";
            }
        }
    };

    return { getboard, setboard,reset};
})();

function create_player(name, marker) {
    return { name, marker };
}

const Game = (function () {
   
    const player1 = create_player("atishay", "X");
    const player2 = create_player("aditi", "O");

    const anywin = (player) => {
        const { name, marker } = player;
        const board = Gameboard.getboard();

        // rows
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === marker && board[i][1] === marker && board[i][2] === marker) {
                return true;
            }
        }

        // columns
        for (let j = 0; j < 3; j++) {
            if (board[0][j] === marker && board[1][j] === marker && board[2][j] === marker) {
                return true;
            }
        }

        // diagonals
        if (
            (board[0][0] === marker && board[1][1] === marker && board[2][2] === marker) ||
            (board[0][2] === marker && board[1][1] === marker && board[2][0] === marker)
        ) {
            return true;
        }

        return false;
    };

    return { player1, player2, anywin }; // expose if needed
})();


// Gameboard.setboard(0, 0, "X");
// Gameboard.setboard(0, 1, "X");
// Gameboard.setboard(0, 2, "O");

// console.log(Game.anywin(Game.player1)); //       



const display= (function (){

}
)();