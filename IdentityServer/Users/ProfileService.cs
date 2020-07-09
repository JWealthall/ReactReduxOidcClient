using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using IdentityServer4.Extensions;
using IdentityServer4.Models;
using IdentityServer4.Services;

namespace IdentityServer.Users
{
    public class ProfileService : IProfileService
    {
        private readonly IUserStore _appUsers;

        public ProfileService(IUserStore appUsers)
        {
            _appUsers = appUsers;
        }

        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            var sub = context.Subject.GetSubjectId();
            var user = await _appUsers.FindBySubjectId(sub);
            if (user == null) throw new ArgumentException("Cannot find user by subject id");
            // TODO: Change this to only add the claims requested in the context
            //List<Claim> claims = context.Subject.Claims.Where(x => x.Type == JwtClaimTypes.Role).ToList();
            context.IssuedClaims.AddRange(user.Claims.ConvertAll(new Converter<AppUserClaim, Claim>(AppUserClaim.ToClaim)));
        }

        public async Task IsActiveAsync(IsActiveContext context)
        {
            var sub = context.Subject.GetSubjectId();
            var user = await _appUsers.FindBySubjectId(sub);
            if (user == null) throw new ArgumentException("Cannot find user by subject id");
            context.IsActive = true;
        }
    }
}
