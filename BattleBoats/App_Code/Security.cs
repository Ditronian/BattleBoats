using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace BattleBoats
{
    public static class Security
    {
        //New SHA512 encrypt code fo sho
        public static Byte[] encrypt(string unencryptedString)
        {
            // encrypt password before inserted..
            Byte[] hashedDataBytes = null;
            UTF8Encoding encoder = new UTF8Encoding();

            SHA512 shaM = new SHA512Managed();
            hashedDataBytes = shaM.ComputeHash(encoder.GetBytes(unencryptedString));

            return hashedDataBytes;
        }
    }
}