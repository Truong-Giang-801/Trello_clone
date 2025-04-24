using FirebaseAdmin.Auth;
using MongoDB.Driver;
using UserServiceApi.Models;
using System.Net.Http;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;
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
    // Fetch all users from Firebase Authentication
    var users = new List<User>();
    var pagedEnumerable = FirebaseAuth.DefaultInstance.ListUsersAsync(null);

    await foreach (var userRecord in pagedEnumerable)
    {
        var user = new User
        {
            Uid = userRecord.Uid,
            Email = userRecord.Email ?? string.Empty,
            DisplayName = userRecord.DisplayName,
            PhoneNumber = userRecord.PhoneNumber,
            role = "User" // Default role, adjust as needed
        };

        // Check if the email already exists in MongoDB
        var existingUser = await _users.Find(u => u.Email == user.Email).FirstOrDefaultAsync();

        if (existingUser != null)
        {
            // Preserve the _id field from the existing user
            user.Id = existingUser.Id;

            // Update the existing user
            await _users.ReplaceOneAsync(
                u => u.Email == user.Email,
                user,
                new ReplaceOptions { IsUpsert = true } // Perform upsert
            );
        }
        else
        {
            // Insert the new user
            await _users.InsertOneAsync(user);
        }

        users.Add(user);
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

    public async Task <User?> GetUserByEmailAsync(string email)
    {
        return await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
    }
public async Task DeleteUserAndAssociatedDataAsync(string userId)
{
    if (string.IsNullOrEmpty(userId))
    {
        throw new ArgumentException("User ID cannot be null or empty.", nameof(userId));
    }

    try
    {
        using var httpClient = new HttpClient();

        // Delete all workspaces owned by the user
        var workspaceResponse = await httpClient.DeleteAsync($"http://localhost:5251/api/workspace/user/{userId}");
        if (workspaceResponse.StatusCode != System.Net.HttpStatusCode.NotFound && !workspaceResponse.IsSuccessStatusCode)
        {
            throw new InvalidOperationException($"Failed to delete workspaces for user {userId}. Response: {workspaceResponse.StatusCode}");
        }

        // Get all boards owned by the user
        var boardsResponse = await httpClient.GetAsync($"http://localhost:5251/api/board/user/{userId}");
        if (!boardsResponse.IsSuccessStatusCode)
        {
            throw new InvalidOperationException($"Failed to fetch boards for user {userId}. Response: {boardsResponse.StatusCode}");
        }

        var boards = JsonSerializer.Deserialize<List<Board>>(await boardsResponse.Content.ReadAsStringAsync());
        foreach (var board in boards)
        {
            // Get all lists in the board
            var listsResponse = await httpClient.GetAsync($"http://localhost:5251/api/list/board/{board.Id}");
            if (!listsResponse.IsSuccessStatusCode)
            {
                throw new InvalidOperationException($"Failed to fetch lists for board {board.Id}. Response: {listsResponse.StatusCode}");
            }

            var lists = JsonSerializer.Deserialize<List<List>>(await listsResponse.Content.ReadAsStringAsync());
            foreach (var list in lists)
            {
                // Delete all cards in the list
                var cardsResponse = await httpClient.GetAsync($"http://localhost:5251/api/card/list/{list.Id}");
                if (!cardsResponse.IsSuccessStatusCode)
                {
                    throw new InvalidOperationException($"Failed to fetch cards for list {list.Id}. Response: {cardsResponse.StatusCode}");
                }

                var cards = JsonSerializer.Deserialize<List<Card>>(await cardsResponse.Content.ReadAsStringAsync());
                foreach (var card in cards)
                {
                    var deleteCardResponse = await httpClient.DeleteAsync($"http://localhost:5251/api/card/{card.Id}");
                    if (!deleteCardResponse.IsSuccessStatusCode)
                    {
                        throw new InvalidOperationException($"Failed to delete card {card.Id}. Response: {deleteCardResponse.StatusCode}");
                    }
                }

                // Delete the list itself
                var deleteListResponse = await httpClient.DeleteAsync($"http://localhost:5251/api/list/{list.Id}");
                if (!deleteListResponse.IsSuccessStatusCode)
                {
                    throw new InvalidOperationException($"Failed to delete list {list.Id}. Response: {deleteListResponse.StatusCode}");
                }
            }

            // Delete the board itself
            var deleteBoardResponse = await httpClient.DeleteAsync($"http://localhost:5251/api/board/{board.Id}");
            if (!deleteBoardResponse.IsSuccessStatusCode)
            {
                throw new InvalidOperationException($"Failed to delete board {board.Id}. Response: {deleteBoardResponse.StatusCode}");
            }
        }

        // Delete the user from MongoDB
        var deleteUserResponse = await httpClient.DeleteAsync($"http://localhost:5251/api/user/{userId}");
        if (!deleteUserResponse.IsSuccessStatusCode)
        {
            throw new InvalidOperationException($"Failed to delete user {userId} from MongoDB. Response: {deleteUserResponse.StatusCode}");
        }

        // Delete the user from Firebase Authentication
        try
        {
            await FirebaseAuth.DefaultInstance.DeleteUserAsync(userId);
            Console.WriteLine($"Deleted user {userId} from Firebase Authentication.");
        }
        catch (FirebaseAuthException ex)
        {
            Console.Error.WriteLine($"Error deleting user from Firebase Authentication: {ex.Message}");
            throw new InvalidOperationException($"Failed to delete user {userId} from Firebase Authentication.");
        }

        Console.WriteLine($"Deleted user {userId} and all associated data successfully.");
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine($"Error deleting user and associated data: {ex.Message}");
        throw;
    }
}
}