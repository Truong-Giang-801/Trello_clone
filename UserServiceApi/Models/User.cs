using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace UserServiceApi.Models;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string Uid { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? DisplayName { get; set; }
    public string? role { get; set; }
    public string? PhoneNumber { get; set; }
    
}
