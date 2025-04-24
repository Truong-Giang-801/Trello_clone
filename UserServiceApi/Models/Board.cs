// filepath: d:\Document for Uni\year 4\app design\Trello_clone\Trello_clone\UserServiceApi\Models\Board.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace UserServiceApi.Models
{
    public class Board
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("ownerId")]
        public string OwnerId { get; set; } = string.Empty;

        [BsonElement("title")]
        public string Title { get; set; } = string.Empty;

        [BsonElement("workspaceId")]
        public string WorkspaceId { get; set; } = string.Empty;

        [BsonElement("visibility")]
        public string Visibility { get; set; } = "Private"; // Default visibility

        [BsonElement("memberIds")]
        public List<string> MemberIds { get; set; } = new List<string>();

        [BsonElement("listIds")]
        public List<string> ListIds { get; set; } = new List<string>();
    }
}