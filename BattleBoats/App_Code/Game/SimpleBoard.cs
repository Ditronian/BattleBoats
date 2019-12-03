namespace BattleBoats
{
    /**
     * Very simple wrapper data type for passing boards to the JS font end.... Stored as an array of integers, with
     * the width and height specified separately...
     */
    public class SimpleBoard
    {
        public int width;
        public int height;
        public int[] data;

        public SimpleBoard(int width, int height, int[] data)
        {
            this.width = width;
            this.height = height;
            this.data = data;
        }
    }
}