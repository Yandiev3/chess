Installation

To run the game locally, follow these steps:





Clone the Repository (or download the source files):

git clone <repository-url>



Navigate to the Project Directory:

cd chess-game



Ensure File Structure:





index.html: Main HTML file.



script.js: JavaScript logic for game functionality.



style.css: CSS for styling the game.



blackShapes/ and whiteShapes/: Folders containing SVG images for chess pieces.



Serve the Files:





Use a local web server (e.g., Live Server in VS Code, or Python's HTTP server):

python -m http.server 8000



Alternatively, open index.html directly in a browser (note: some features may require a server due to file access restrictions).



Access the Game:





Open your browser and navigate to http://localhost:8000 (or the port used by your server).

Usage





Start the Game:





Open the game in a browser. The board initializes with white to move first.



Move Pieces:





Click: Click a piece to select it (highlights possible moves), then click a highlighted square to move.



Drag-and-Drop: Drag a piece to a valid square to move it.



Pawn Promotion:





When a pawn reaches the opponent's end, a modal appears to select a promotion piece.



Game Over:





The game ends when a king is captured (simplified checkmate detection). A modal displays the winner.



Click "Новая игра" (New Game) to reset and start a new game.



Captured Pieces:





Captured pieces are displayed in the side panels for both players.

File Structure

chess-game/
├── index.html          # Main HTML file
├── script.js           # Game logic and interactivity
├── style.css           # Styling for the game
├── blackShapes/        # SVG images for black pieces
│   ├── blackRook.svg
│   ├── blackKnight.svg
│   ├── blackBishop.svg
│   ├── blackQueen.svg
│   ├── blackKing.svg
│   ├── blackPawn.svg
├── whiteShapes/        # SVG images for white pieces
│   ├── whiteRook.svg
│   ├── whiteKnight.svg
│   ├── whiteBishop.svg
│   ├── whiteQueen.svg
│   ├── whiteKing.svg
│   ├── whitePawn.svg
└── README.md           # Project documentation

Technologies Used





HTML5: Structure of the game interface.



CSS3: Styling for the board, pieces, and UI elements.



JavaScript: Game logic, move validation, and drag-and-drop functionality.



SVG Images: Chess piece graphics.
