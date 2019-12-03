using System;

namespace BattleBoats
{
    /**
     * Helper class for keeping track of the users score IN GAME.... Don't use this outside of the game, use ScoresTable...
     */
    public class ScoreKeeper: ICloneable
    {
        // Adjust for differing scores...
        public const int MAX_HIT_SCORE = 100;
        
        // Keeps track of everything needed for the score system
        public int score = 0;
        public int numHits = 0;
        public int numAttempts = 0;
        public int movesSinceLastHit = 0;
        public int shipsSunk = 0;

        public void atempt(bool wasHit)
        {
            numAttempts++;
            movesSinceLastHit++;
            if (movesSinceLastHit > 10) movesSinceLastHit = 10;
            if (wasHit)
            {
                score += (MAX_HIT_SCORE / movesSinceLastHit);
                movesSinceLastHit = 0;
                numHits++;
            }
        }

        public void shipSunk()
        {
            // Makes scoring worth half the current amount...
            shipsSunk++;
            movesSinceLastHit *= 2;
        }

        public object Clone()
        {
            // Copies all fields of this object to a new scorekeeper and return it...
            ScoreKeeper obj = new ScoreKeeper();
            obj.score = score;
            obj.numHits = numHits;
            obj.numAttempts = numAttempts;
            obj.movesSinceLastHit = movesSinceLastHit;
            obj.shipsSunk = shipsSunk;
            return obj;
        }
    }
}