using System;
using System.Collections.Generic;

namespace BattleBoats
{
    // Beginings of union find data structure...
    public class GameBoardUF
    {
        private int[] elements;
        private int[] size;
        private HashSet<int> components;

        public GameBoardUF(int size)
        {
            // Initialize arrays fill them with the correct values....
            this.elements = new int[size];
            this.size = new int[size];

            for (int i = 0; i < this.elements.Length; i++)
            {
                this.elements[i] = i;
                this.size[i] = 1;
                this.components.Add(i);
            }
        }

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

        public bool connected(int p, int q)
        {
            return root(p) == root(q);
        }

        public void addEdge(int p, int q)
        {
            // If they are already connected just return....
            if (connected(p, q)) return;
            // Find the roots of p and q...
            int pRoot = root(p);
            int qRoot = root(q);
            if (size[q] < size[p])
            {
                // Case 1: Size of p tree is bigger, add q underneath p...
                elements[qRoot] = pRoot;
                size[pRoot] += size[qRoot];
                size[qRoot] = 0;
                components.Remove(qRoot);
            }
            else
            {
                // Case 2: Size of q was bigger, add p under q...
                elements[qRoot] = pRoot;
                size[qRoot] += size[pRoot];
                size[pRoot] = 0;
                components.Remove(pRoot);
            }
        }

        public int componentSize(int elem)
        {
            return size[root(elem)];
        }

        public IEnumerator<int> getComponents()
        {
            return this.components.GetEnumerator();
        }
    }
}