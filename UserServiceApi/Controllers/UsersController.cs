using Microsoft.AspNetCore.Mvc;
using UserServiceApi.Models;
using UserServiceApi.Services;

namespace UserServiceApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserService _userService;

    public UsersController(UserService userService)
    {
        _userService = userService;
    }

    /// <summary>
    /// Synchronizes a user with the database.
    /// </summary>
    [HttpPost("sync")]
    public async Task<IActionResult> SyncUser()
    {
        var users = await _userService.SyncUsersFromFirebaseAsync();
        return Ok(users); // Return the list of synchronized users
    }
    /// <summary>
    /// Creates a new user.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] User user)
    {
        if (user == null)
        {
            return BadRequest("User data is required.");
        }

        await _userService.CreateUserAsync(user);
        return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
    }

    /// <summary>
    /// Retrieves a user by ID.
    /// </summary>
    [HttpGet("{id:length(24)}")]
    public async Task<IActionResult> GetUserById(string id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    /// <summary>
    /// Updates an existing user.
    /// </summary>
    [HttpPut("{id:length(24)}")]
    public async Task<IActionResult> UpdateUser(string id, [FromBody] User updatedUser)
    {
        if (updatedUser == null || id != updatedUser.Id)
        {
            return BadRequest("Invalid user data.");
        }

        var user = await _userService.GetUserByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        await _userService.UpdateUserAsync(id, updatedUser);
        return NoContent();
    }

    /// <summary>
    /// Deletes a user by ID.
    /// </summary>
    /// 
    [HttpDelete("{id:length(24)}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        await _userService.DeleteUserAsync(id);
        return NoContent();
    }
    [HttpGet("uid/{uid}")]
    public async Task<IActionResult> GetUserByUid(string uid)
    {
        var user = await _userService.GetUserByUidAsync(uid);
        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }
}