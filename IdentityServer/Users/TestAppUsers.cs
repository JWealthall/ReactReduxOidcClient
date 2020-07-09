using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IdentityModel;
using System.Security.Claims;
using IdentityServer4;
using Newtonsoft.Json;

namespace IdentityServer.Users
{
    public class TestAppUsers
    {
        public static List<AppUser> Users
        {
            get
            {
                var address = new
                {
                    street_address = "One Hacker Way",
                    locality = "Heidelberg",
                    postal_code = 69118,
                    country = "Germany"
                };
                
                return new List<AppUser>
                {
                    new AppUser("818727", "alice", "AliceSmith@email.com", "alice")
                    {
                        Claims =
                        {
                            new AppUserClaim(JwtClaimTypes.Name, "Alice Smith"),
                            new AppUserClaim(JwtClaimTypes.GivenName, "Alice"),
                            new AppUserClaim(JwtClaimTypes.FamilyName, "Smith"),
                            //new AppUserClaim(JwtClaimTypes.Email, "AliceSmith@email.com"),
                            new AppUserClaim(JwtClaimTypes.EmailVerified, "true", ClaimValueTypes.Boolean),
                            new AppUserClaim(JwtClaimTypes.WebSite, "http://alice.com"),
                            new AppUserClaim(JwtClaimTypes.Address, JsonConvert.SerializeObject(address), IdentityServerConstants.ClaimValueTypes.Json),
                            new AppUserClaim(JwtClaimTypes.PhoneNumber, "555 555 551"),
                            new AppUserClaim(JwtClaimTypes.PhoneNumberVerified, "true", ClaimValueTypes.Boolean)
                        }
                    },
                    new AppUser("88421113", "bob", "BobSmith@email.com", "bob")
                    {
                        Claims =
                        {
                            new AppUserClaim(JwtClaimTypes.Name, "Bob Smith"),
                            new AppUserClaim(JwtClaimTypes.GivenName, "Bob"),
                            new AppUserClaim(JwtClaimTypes.FamilyName, "Smith"),
                            //new AppUserClaim(JwtClaimTypes.Email, "BobSmith@email.com"),
                            new AppUserClaim(JwtClaimTypes.EmailVerified, "true", ClaimValueTypes.Boolean),
                            new AppUserClaim(JwtClaimTypes.WebSite, "http://bob.com"),
                            new AppUserClaim(JwtClaimTypes.Address, JsonConvert.SerializeObject(address), IdentityServerConstants.ClaimValueTypes.Json),
                            new AppUserClaim(JwtClaimTypes.PhoneNumber, "555 555 552"),
                            new AppUserClaim(JwtClaimTypes.PhoneNumberVerified, "true", ClaimValueTypes.Boolean)
                        }
                    }
                };
            }
        }
    }
}
