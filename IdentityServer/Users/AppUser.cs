using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using IdentityModel;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace IdentityServer.Users
{
    public class AppUser
    {
        public AppUser() { }

        public AppUser(string userName, string password = "")
        {
            SubjectId = CryptoRandom.CreateUniqueId();
            SetUserName(userName);
            if (userName.IsValidEmail()) SetEmail(userName);
            if (!string.IsNullOrEmpty(password)) SetPassword(password);
        }

        public AppUser(string subjectId, string userName, string email, string password = "")
        {
            SubjectId = string.IsNullOrEmpty(subjectId) ? CryptoRandom.CreateUniqueId() : subjectId;
            SetUserName(userName);
            if (userName.IsValidEmail() && string.IsNullOrEmpty(email)) SetEmail(userName);
            if (!string.IsNullOrEmpty(email)) SetEmail(email);
            if (!string.IsNullOrEmpty(password)) SetPassword(password);
        }

        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(512)]
        public string SubjectId { get; set; }

        [Required]
        [MaxLength(256)]
        public string Username { get; set; }
        [Required]
        [MaxLength(256)]
        public string NormalizedUsername { get; set; }

        [Required]
        [MaxLength(256)]
        public string Email { get; set; }
        [Required]
        [MaxLength(256)]
        public string NormalizedEmail { get; set; }
        public bool EmailConfirmed { get; set; }

        public string PasswordSalt { get; set; }
        public string PasswordHash { get; set; }
        public string ProviderName { get; set; }

        [MaxLength(512)]
        public string ProviderSubjectId { get; set; }

        [MaxLength(100)]
        public string PhoneNumber { get; set; }
        public bool PhoneNumberConfirmed { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public DateTimeOffset? LockoutEnd { get; set; }
        public bool LockoutEnabled { get; set; }
        public int AccessFailedCount { get; set; }

        [Timestamp]
        public byte[] TimeStamp { get; set; }   // Should be used for concurrency control

        public virtual List<AppUserClaim> Claims { get; set; }

        public static string PasswordSaltInBase64()
        {
            var salt = new byte[32]; // 256 bits
            using (var random = RandomNumberGenerator.Create())
            {
                random.GetBytes(salt);
            }
            return Convert.ToBase64String(salt);
        }

        public static string PasswordToHashBase64(string plaintextPassword, string storedPasswordSaltBase64)
        {
            var salt = Convert.FromBase64String(storedPasswordSaltBase64);
            var bytearray = KeyDerivation.Pbkdf2(plaintextPassword, salt, KeyDerivationPrf.HMACSHA512, 50000, 24);
            return Convert.ToBase64String(bytearray);
        }

        public static bool PasswordValidation(string storedPasswordHashBase64, string storedPasswordSaltBase64, string plaintextToValidate)
        {
            return storedPasswordHashBase64.Equals(PasswordToHashBase64(plaintextToValidate, storedPasswordSaltBase64));
        }

        public void ClaimAdd(AppUserClaim claim)
        {
            Claims ??= new List<AppUserClaim>();
            Claims.Add(claim);
        }

        public void ClaimRemove(AppUserClaim claim)
        {
            Claims ??= new List<AppUserClaim>();
            Claims.Remove(claim);
        }

        public void ClaimReplace(AppUserClaim claim)
        {
            Claims ??= new List<AppUserClaim>();
            var oldClaim = Claims.Find(c => c.Type == claim.Type);
            if (oldClaim != null) Claims.Remove(oldClaim);
            Claims.Add(claim);
        }

        public void SetPassword(string password)
        {
            PasswordSalt = PasswordSaltInBase64();
            PasswordHash = PasswordToHashBase64(password, PasswordSalt);
        }

        public void SetUserName(string userName)
        {
            Username = userName;
            NormalizedUsername = userName.Normalize(NormalizationForm.FormKD).ToUpperInvariant();
        }

        public void SetEmail(string email)
        {
            Email = email;
            NormalizedEmail = email.Normalize(NormalizationForm.FormKD).ToUpperInvariant();
            ClaimReplace(new AppUserClaim(JwtClaimTypes.Email, email));
        }
    }
}
