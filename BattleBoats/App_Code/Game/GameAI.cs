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
            // TODO: Looks like this is going to be a little complicated...
            // We need to somehow randomly place boats without collisions and without making to many guesses...
            // Since I have sorted the boat sizes we know every ship after this ship won't fit in a location if this
            // ship can't, might be a useful property... Think general idea is to build ship in some direction,
            // if it fails try another direction... If all directions fail remove spot from possible spots and try
            // another spot... Will work on this later...
            return null;
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