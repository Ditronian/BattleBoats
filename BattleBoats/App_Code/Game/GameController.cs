namespace BattleBoats
{
    /**
     * Represents a game controller. A controller is like a user, who selects where to place the ships and then
     * picks where to attack.
     */
    public abstract class GameController
    {
        /**
         * Allow the controller to plot ships, given the width and height of the array. Returns an integer array...
         */
        public abstract int[] plotShips(int w, int h, int[] boatSizes);

        /**
         * Plays a single move. Return an x y coordinate being the tile to attempt to shoot on...
         */
        public abstract Coordinate playMove(PlayerBoards gameData);
    }

    // Stores a coordinate...
    public class Coordinate
    {
        public int x = 0;
        public int y = 0;

        public Coordinate(int x, int y)
        {
            this.x = x;
            this.y = y;
        }
        public Coordinate(){}
    }
}