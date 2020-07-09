using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using IdentityServer4.Extensions;

namespace IdentityServer.Users
{
    public class AppUserClaim
    {
        public AppUserClaim() { }
        public AppUserClaim(string type, string value) { 
            Type = type;
            Value = value;
        }
        public AppUserClaim(string type, string value, string valueType)
        {
            Type = type;
            Value = value;
            ValueType = valueType;
        }
        public AppUserClaim(string type, string value, string valueType, string issuer)
        {
            Type = type;
            Value = value;
            ValueType = valueType;
            Issuer = issuer;
        }
        public AppUserClaim(Claim claim)
        {
            Type = claim.Type;
            Value = claim.Value;
            ValueType = claim.ValueType;
            Issuer = claim.Issuer;
            OriginalIssuer = claim.OriginalIssuer;
            SubjectId = claim.Subject.GetSubjectId();
        }

        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        [Required]
        public AppUser AppUser { get; set; }
        public string SubjectId { get; set; }
        public string Issuer { get; set; }
        public string OriginalIssuer { get; set; }
        public string Type { get; set; }
        public string Value { get; set; }
        public string ValueType { get; set; }

        [Timestamp]
        public byte[] TimeStamp { get; set; }   // Should be used for concurrency control

        public static Claim ToClaim(AppUserClaim c)
        {
            return new Claim(c.Type, c.Value, c.ValueType, c.Issuer, c.OriginalIssuer);
        }
    }
}
