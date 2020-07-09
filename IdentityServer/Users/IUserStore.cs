using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace IdentityServer.Users
{
    public interface IUserStore
    {
        Task<bool> ValidateCredentials(string username, string password);
        Task<AppUser> FindBySubjectId(string subjectId);
        Task<AppUser> FindByUsername(string username);
        Task<AppUser> FindByExternalProvider(string provider, string subjectId);
        Task<AppUser> AutoProvisionUser(string provider, string subjectId, IEnumerable<Claim> claims);
        Task<AppUser> AutoProvisionUser(string provider, string subjectId, List<AppUserClaim> claims);
        Task<bool> SaveAppUser(AppUser user, string newPasswordToHash = null);
    }
}
