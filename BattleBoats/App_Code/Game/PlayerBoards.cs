namespace BattleBoats
{
    // Core communication class for communicating player data with the JS frontend. Contains users board of ships, 
    // the users attack board, score data, and some other helpful information for JS Front end...
    public class PlayerBoards
    {
        // The user's board of ships, keeps track of water/boat and what is also sunk.
        public SimpleBoard shipBoard;
        // The user's attempted attach, keeps track of hits/misses also.
        public SimpleBoard hitBoard;
        // Keeps track of user score, hits, misses, etc.
        public ScoreKeeper scoreData;
        // Integer array of size 2, keeps track of the coordinates of the last AI hit...
        public int[] aiHit = null;
        // Boolean, stores if last player attempt was a hit or a miss...
        public bool hitAShip = false;
        // Becomes true when the game is over...
        public bool gameOver = false;
        // It set when game over is set to true, determines if AI or the player won...
        public bool playerWins = false;

        // Construct a new player board data wrapper with the required fields...
        public PlayerBoards(SimpleBoard shipBoard, SimpleBoard hitBoard, ScoreKeeper scoreData)
        {
            this.shipBoard = shipBoard;
            this.hitBoard = hitBoard;
            this.scoreData = (ScoreKeeper)scoreData.Clone();
        }
    }
}