using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using IdentityModel;
using Microsoft.EntityFrameworkCore;

namespace IdentityServer.Users
{
    public class AppUserStore : IUserStore
    {
        private readonly AppUserContext _appDb;
        public AppUserStore(AppUserContext context)
        {
            _appDb = context;
        }

        public async Task<AppUser> AutoProvisionUser(string provider, string subjectId, IEnumerable<Claim> claims)
        {
            var appUserClaims = new List<AppUserClaim>();
            foreach (var claim in claims)
            {
                appUserClaims.Add(new AppUserClaim(claim));
            }
            return await AutoProvisionUser(provider, subjectId, appUserClaims);
        }

        public async Task<AppUser> AutoProvisionUser(string provider, string subjectId, List<AppUserClaim> claims)
        {
        // create a list of claims that we want to transfer into our store
        var filtered = new List<AppUserClaim>();

        foreach(var claim in claims)
        {
            // if the external system sends a display name - translate that to the standard OIDC name claim
            if(claim.Type == ClaimTypes.Name)
            {
                filtered.Add(new AppUserClaim(JwtClaimTypes.Name, claim.Value));
            }
            // if the JWT handler has an outbound mapping to an OIDC claim use that
            else if(JwtSecurityTokenHandler.DefaultOutboundClaimTypeMap.ContainsKey(claim.Type))
            {
                filtered.Add(new AppUserClaim(JwtSecurityTokenHandler.DefaultOutboundClaimTypeMap[claim.Type], claim.Value));
            }
            // copy the claim as-is
            else
            {
                filtered.Add(claim);
            }
        }

        // if no display name was provided, try to construct by first and/or last name
        if(filtered.All(x => x.Type != JwtClaimTypes.Name))
        {
            var first = filtered.FirstOrDefault(x => x.Type == JwtClaimTypes.GivenName)?.Value;
            var last = filtered.FirstOrDefault(x => x.Type == JwtClaimTypes.FamilyName)?.Value;
            if(first != null && last != null)
            {
                filtered.Add(new AppUserClaim(JwtClaimTypes.Name, first + " " + last));
            }
            else if(first != null)
            {
                filtered.Add(new AppUserClaim(JwtClaimTypes.Name, first));
            }
            else if(last != null)
            {
                filtered.Add(new AppUserClaim(JwtClaimTypes.Name, last));
            }
        }

        // create a new unique subject id
        var sub = CryptoRandom.CreateUniqueId();

        // check if a display name is available, otherwise fallback to subject id
        var name = filtered.FirstOrDefault(c => c.Type == JwtClaimTypes.Name)?.Value ?? sub;

        // create new user
        var user = new AppUser(name)
        {
            ProviderName = provider,
            ProviderSubjectId = subjectId,
            Claims = filtered
        };

        // store it and give it back
        await SaveAppUser(user);
        return user;
        }

        public async Task<AppUser> FindByExternalProvider(string provider, string subjectId)
        {
            var appUser = await _appDb.AppUsers.FirstOrDefaultAsync(u => u.ProviderName == provider && u.ProviderSubjectId == subjectId);
            if (appUser != null) appUser.Claims = await _appDb.AppUserClaims.Where(c => c.AppUser.Id == appUser.Id).ToListAsync();
            return appUser;
        }

        public async Task<AppUser> FindBySubjectId(string subjectId)
        {
            var appUser = await _appDb.AppUsers.FirstOrDefaultAsync(u => u.SubjectId == subjectId);
            if (appUser != null) appUser.Claims = await _appDb.AppUserClaims.Where(c => c.AppUser.Id == appUser.Id).ToListAsync();
            return appUser;
        }

        // NB: This will fall back to email if it can't find username
        public async Task<AppUser> FindByUsername(string username)
        {
            var normalizeUsername = username.Normalize(NormalizationForm.FormKD).ToUpperInvariant();
            var appUser = await _appDb.AppUsers.FirstOrDefaultAsync(u => u.NormalizedUsername == normalizeUsername) ??
                          await _appDb.AppUsers.FirstOrDefaultAsync(u => u.NormalizedEmail == normalizeUsername);
            if (appUser != null) appUser.Claims = await _appDb.AppUserClaims.Where(c => c.AppUser.Id == appUser.Id).ToListAsync();
            return appUser;
        }

        public async Task<bool> SaveAppUser(AppUser user, string newPasswordToHash = null)
        {
            try
            {
                if (!string.IsNullOrEmpty(newPasswordToHash)) user.SetPassword(newPasswordToHash);
                await _appDb.AppUsers.AddAsync(user);
                await _appDb.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        // NB: This will fall back to email if it can't find username
        public async Task<bool> ValidateCredentials(string username, string password)
        {
            string hash = null;
            string salt = null;
            var normalizeUsername = username.Normalize(NormalizationForm.FormKD).ToUpperInvariant();

            var appUser = await _appDb.AppUsers.FirstOrDefaultAsync(u => u.NormalizedUsername == normalizeUsername) ??
                          await _appDb.AppUsers.FirstOrDefaultAsync(u => u.NormalizedEmail == normalizeUsername);
            if (appUser != null)
            {
                hash = appUser.PasswordHash;
                salt = appUser.PasswordSalt;
            }

            return (!string.IsNullOrEmpty(salt) && !string.IsNullOrEmpty(hash)) && AppUser.PasswordValidation(hash, salt, password);
        }
    }
}
