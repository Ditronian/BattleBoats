using System;
using System.Collections.Generic;

namespace BattleBoats
{
    public class GameAI
    {
        private int w;
        private int h;
        private int[] boatSizes;
        private int[] guesses;
        private int guessesMade;
        private Random rando;
        
        public GameAI(GameSettings gs)
        {
            this.w = gs.boardWidth;
            this.h = gs.boardHeight;
            this.boatSizes = gs.boatSizes;
            Array.Sort(this.boatSizes);
            // Fill the guesses array....
            guessesMade = 0;
            guesses = new int[w * h];
            for (int i = 0; i < guesses.Length; i++) guesses[i] = i;
            // Make the random number generator...
            rando = new Random();
        }

        public int[] buildBoard()
        {
            int[] board = new int[w * h];
            int alreadySeen = 0;
            int[] boatLoc = (int[]) guesses.Clone();

            for (int boatIdx = 0; boatIdx < boatSizes.Length; boatIdx++)
            {
                while (true)
                {
                    // If we have exhausted all spots, throw an error, the board was not big enough...
                    if (alreadySeen == (boatLoc.Length - 1))
                    {
                        throw new ArgumentException("Board not big enough to fit all boats!!!");
                    }
                    
                    int randomIdx = rando.Next(alreadySeen, boatLoc.Length);
                    // Remove this random selection from the valid options...
                    int temp = boatLoc[randomIdx];
                    boatLoc[randomIdx] = boatLoc[alreadySeen];
                    boatLoc[alreadySeen] = temp;
                    alreadySeen++;
                    // Get the index and test to see if boat can be placed...
                    int[] coord = from1D(temp);
                    // Random boolean to test if vertical/horizontal should be attempted first...
                    bool vertical = (rando.Next(2) == 0);
                    
                    // Ok, this is ugly, look away... Ton of one liners....
                    
                    // If succeeds with current vertical setting leave boolean as-is an move to next step...
                    if (testBoat(coord[0], coord[1], boatSizes[boatIdx], vertical, board)) ;
                    // If succeeds with reversed vert/horiz setting flip the boolean and move to next step
                    else if (testBoat(coord[0], coord[1], boatSizes[boatIdx], !vertical, board)) vertical = !vertical;
                    // Otherwise we didn't find any configuration of the boat that works on this tile, iterate again...
                    else continue;
                    
                    // Represents derivative of x and y per step of the loop... Determined by vertical setting...
                    int[] transform = (vertical)? new int[] {0, 1} : new int[] {1, 0};
                    // Plot the boat, and break the loop....
                    for (int i = 0; i < boatSizes[boatIdx]; i++)
                    {
                        board[from2D(coord[0] + (i * transform[0]), coord[1] + (i * transform[1]))] = boatIdx + 1;
                    }
                    break;
                }
            }
            // Return the filled out board...
            return board;
        }

        private int from2D(int x, int y)
        {
            return (y * h) + x;
        }

        private int[] from1D(int loc)
        {
            return new int[] {(loc / w), (loc % w)};
        }

        private bool validIndex(int x, int y)
        {
            return (x >= 0) && (y >= 0) && (x < w) && (y < h);
        }

        private bool testBoat(int x, int y, int boatSize, bool vertical, int[] board)
        {
            // Determine the transform... Used to move horizontally/vertically...
            int[] transform = (vertical)? new int[]{0, 1}: new int[]{1, 0};
            
            // Iterating the size of the ship...
            for (int i = 0; i < boatSize; i++)
            {
                // If falls outside board return false, this spot won't work
                if (!validIndex(x + (i * transform[0]), y + (i * transform[1]))) return false;
                // If current spot already taken by boat, this spot won't work...
                if (board[from2D(x + (i * transform[0]), y + (i * transform[1]))] > 0) return false;
            }
            // We checked tiles and none of them caused collisions, return true...
            return true;
        }

        public int[] makeGuess()
        {
            // Pick a random guess from unselected guesses...
            int guessIdx = rando.Next(guessesMade, guesses.Length);
            // Swap guess with item at current number of guesses made location...
            int thisGuess = guesses[guessIdx];
            guesses[guessIdx] = guesses[guessesMade];
            guesses[guessesMade] = thisGuess;
            // Increment number of guesses made...
            guessesMade++;
            // Return the just selected guess...
            return from1D(thisGuess);
        }
    }
}