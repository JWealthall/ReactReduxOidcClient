## Secured React Redux Client using IdentityServer4 with custom EF User Store

This the result of the basic Identity Server tutorial with added examples of:
- A [Secured React Redux Client]
  - A working Silent Log In
  - Display of the logged in user (when it has been loaded)
  - Secures an API method (with example call)
  - Protected Route component (with auto direct to login)
- An [Entity Framework Core User Store]
  - Has a custom profile service to include additions claims.
    Note that this is not selective (yet) and just supplies all of them
  - Does not (yet) contain a page for registering a user

This was part of some training I was doing, but I could not find working examples of what I trying to achieve.  Now that it appears to be working I've loaded this to GitHub
for others to use.

### Secured React Redux Client

This is an update to the basic .Net Core React Redux project
- Updated to use the Redux Toolkit
- Added the [Open Id JavaScript client](https://github.com/IdentityModel/oidc-client-js)
- Added the [Redux OIDC](https://github.com/maxmantz/redux-oidc) package
  - I was considering writing my own version of this, but, as it works just fine, I decided against that
- Added a user reducer to allow me to track the state and flow of the login status
  - Handling the flow allowed me to make sure I was not redirecting to the log in server whilst I was still performing a silent renew
- Added processing to handle the load/login of a user synchronously
- Built up the *CallBack* components for both silent and full log in
- Created **ProtectedRoute** by extending Route
  - This needs to be inside a route switch otherwise the render is still called which then forces a redirect to log in
- Displays the logged in user's name (see custom profile service below)

### Entity Framework Core User Store

This is an update to the Identity Server 4 UI project.
- Added a custom User Store
  - Basic Entity Framework Core *Code First* data model
  - Only two tables (so far) - App User and App User Claim
- Added a custom profile service
  - Puts additional claims on the return data (e.g. names and addresses)

### Why?

I started out working on an ECommerce project based on an existing EPOS .Net codebase which is used for both Hospitality and Retail.
The codebase has been flexible enough to have been used with frontends written in Winforms, WPF, Asp, AspX and Asp MVC over the last 15 years.
There's even a self service version out there.
The existing ECom project need a rewrite so I was looking to use either React/Redux or Angular SPAs.

I started out trying to use the standard *.Net Core React template with authentication* and upgraded it to Redux.
That is there the problems started ...

I had been wondering why there was no *.Net Core React/Redux template with authentication*.
The basic template doesn't perform a silent signin and only signs in when you attempt to access a protected page - so you don't know the user till you do.
It turns out that redux doesn't play happily with the SPA authentication code supplied in the react template when you do attempt a silent signin - it will hang when you're trying to debug it in Visual Studio if you make an API call before the user is checked/loaded.
On of the reasons may be the requirement to get the Open Id configuration from the server first.

I wanted to use a generic Open Id client anyway.  I've worked with a number of football (soccer) clients who use different suppliers for marketing, ticketing and ecommerce sites
but now wish to have a single user experience - i.e. they want single sign on.  And currently, the best way to achieve that would be Open Id

### What is left to do

As this was a training/testing project there's a whole heap of things to finish before I'd allow it to see any commercial light of day!  I've listed some below

- A few of these exist in commercial (and are not needed for testing)
  - Add a *registration* system for users
  - Add management system for Apis, Clients, Resources, etc.
  - Add a roles and permissions system for users
- Clean up the code a bit (well quite a log actually)
- Add in a better logging system