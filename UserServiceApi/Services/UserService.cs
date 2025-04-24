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
    public async Task<List<User>> GetAllUsersAsync()
    {
        return await _users.Find(_ => true).ToListAsync();
    }
    public async Task<List<User>> SyncUsersFromFirebaseAsync()
    {
        // Delete all users from MongoDB

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
    public async Task DeleteUserAndAssociatedDataAsync(string userId)
    {
        if (string.IsNullOrEmpty(userId))
        {
            throw new ArgumentException("User ID cannot be null or empty.", nameof(userId));
        }

        try
        {
            // Delete all workspaces owned by the user
            var workspaceCollection = _users.Database.GetCollection<Workspace>("Workspaces");
            var workspaceDeleteResult = await workspaceCollection.DeleteManyAsync(w => w.OwnerId == userId);

            // Delete all boards owned by the user
            var boardCollection = _users.Database.GetCollection<Board>("Boards");
            var boardsOwnedByUser = await boardCollection.Find(b => b.OwnerId == userId).ToListAsync();

            // Delete all lists associated with the user's boards
            var listCollection = _users.Database.GetCollection<List>("Lists");
            foreach (var board in boardsOwnedByUser)
            {
                await listCollection.DeleteManyAsync(l => l.BoardId == board.Id);
            }

            // Delete the boards themselves
            var boardDeleteResult = await boardCollection.DeleteManyAsync(b => b.OwnerId == userId);

            // Finally, delete the user from MongoDB
            var user = await _users.FindOneAndDeleteAsync(u => u.Id == userId);

            if (user == null)
            {
                throw new InvalidOperationException($"User with ID {userId} was not found in MongoDB.");
            }

            // Delete the user from Firebase Authentication
            try
            {
                await FirebaseAuth.DefaultInstance.DeleteUserAsync(user.Uid);
                Console.WriteLine($"Deleted user {userId} from Firebase Authentication.");
            }
            catch (FirebaseAuthException ex)
            {
                Console.Error.WriteLine($"Error deleting user from Firebase Authentication: {ex.Message}");
                throw new InvalidOperationException($"Failed to delete user {userId} from Firebase Authentication.");
            }

            Console.WriteLine($"Deleted user {userId} and associated data: {workspaceDeleteResult.DeletedCount} workspaces, {boardDeleteResult.DeletedCount} boards, lists associated with boards.");
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error deleting user and associated data: {ex.Message}");
            throw;
        }
    }
}