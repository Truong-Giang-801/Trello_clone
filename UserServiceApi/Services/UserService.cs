using FirebaseAdmin.Auth;
using MongoDB.Driver;
using UserServiceApi.Models;

namespace UserServiceApi.Services;

public class UserService
{
    private readonly IMongoCollection<User> _users;

    public UserService(IConfiguration config)
    {
        var settings = config.GetSection("UserDatabase").Get<UserDatabaseSettings>();
        var client = new MongoClient(settings.ConnectionString);
        var database = client.GetDatabase(settings.DatabaseName);
        _users = database.GetCollection<User>(settings.CollectionName);
    }
    public async Task<User?> GetUserByUidAsync(string uid)
    {
        return await _users.Find(user => user.Uid == uid).FirstOrDefaultAsync();
    }
    public async Task<List<User>> SyncUsersFromFirebaseAsync()
    {
        // Delete all users from MongoDB
        await _users.DeleteManyAsync(_ => true);

        // Fetch all users from Firebase Authentication
        var users = new List<User>();
        var pagedEnumerable = FirebaseAuth.DefaultInstance.ListUsersAsync(null);
        await foreach (var userRecord in pagedEnumerable)
        {
            users.Add(new User
            {
                Uid = userRecord.Uid,
                Email = userRecord.Email ?? string.Empty,
                DisplayName = userRecord.DisplayName,
                PhoneNumber = userRecord.PhoneNumber,
                role = "User" // Default role, adjust as needed
            });
        }

        // Insert all users into MongoDB
        if (users.Any())
        {
            await _users.InsertManyAsync(users);
        }

        // Return the list of synchronized users
        return users;
    }
    public async Task CreateUserAsync(User user)
    {
        await _users.InsertOneAsync(user);
    }

    public async Task<User?> GetUserByIdAsync(string id)
    {
        return await _users.Find(u => u.Id == id).FirstOrDefaultAsync();
    }

    public async Task UpdateUserAsync(string id, User updatedUser)
    {
        await _users.ReplaceOneAsync(u => u.Id == id, updatedUser);
    }

    public async Task DeleteUserAsync(string id)
    {
        await _users.DeleteOneAsync(u => u.Id == id);
    }
}