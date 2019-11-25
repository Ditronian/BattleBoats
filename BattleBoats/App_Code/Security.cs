using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace BattleBoats.App_Code
{
    public static class Security
    {
        //Cassens' encrypy code fo sho
        public static Byte[] encrypt(string unencryptedString)
        {
            // encrypt password before inserted..
            Byte[] hashedDataBytes = null;
            UTF8Encoding encoder = new UTF8Encoding();

            MD5CryptoServiceProvider md5Hasher = new MD5CryptoServiceProvider();

            hashedDataBytes = md5Hasher.ComputeHash(encoder.GetBytes(unencryptedString));

            return hashedDataBytes;
        }
    }
}