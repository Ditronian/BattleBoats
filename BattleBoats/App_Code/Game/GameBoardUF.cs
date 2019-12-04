using System.Collections.Generic;
using System.Linq;


namespace BattleBoats
{
    /**
     * Implements a union find data structure with path compression and weighted sensitive merging to achieve
     * best performance... Fastest known algorithm, achieves O(log*(n)), or the iterated logarithm on graphs of
     * n elements...
     */
    public class GameBoardUF
    {
        private int[] elements;
        private int[] elemSize;
        private HashSet<int> components;

        public GameBoardUF(int size)
        {
            // Initialize arrays fill them with the correct values....
            elements = new int[size];
            this.elemSize = new int[size];
            components = new HashSet<int>();

            for (int i = 0; i < this.elements.Length; i++)
            {
                elements[i] = i;
                elemSize[i] = 1;
                components.Add(i);
            }
        }

        // Private Method: Finds the root of a element
        private int root(int elem)
        {
            // If the index here equals itself, we have found the root...
            if (elements[elem] == elem) return elem;
            // Otherwise get the root...
            int elemRoot = root(elements[elem]);
            // Once we have found the root point the current location to the root...
            elements[elem] = elemRoot;
            // Return the root...
            return elemRoot;
        }

        /**
         * Checks if two provided elements are connected to each other, or are in the same component...
         */
        public bool connected(int p, int q)
        {
            // Cheack if the two elements have the same root...
            return root(p) == root(q);
        }

        public void connect(int p, int q)
        {
            // If they are already connected just return....
            if (connected(p, q)) return;
            // Find the roots of p and q...
            int pRoot = root(p);
            int qRoot = root(q);
            if (elemSize[q] < elemSize[p])
            {
                // Case 1: Size of p tree is bigger, add q underneath p...
                elements[qRoot] = pRoot;
                elemSize[pRoot] += elemSize[qRoot];
                elemSize[qRoot] = 0;
                components.Remove(qRoot);
            }
            else
            {
                // Case 2: Size of q was bigger, add p under q...
                elements[pRoot] = qRoot;
                elemSize[qRoot] += elemSize[pRoot];
                elemSize[pRoot] = 0;
                components.Remove(pRoot);
            }
        }

        /**
         * Gets the size of the component which contains this element.
         */
        public int componentSize(int elem)
        {
            return elemSize[root(elem)];
        }

        /**
         * Get all the current components which currently exist...
         */
        public int[] getComponents()
        {
            return this.components.ToArray();
        }

        /**
         * Get the number of components in this current union find object...
         */
        public int numberComponents()
        {
            return components.Count;
        }
    }
}