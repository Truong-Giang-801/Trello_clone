using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace UserServiceApi.Models
{
    public class Workspace
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("title")]
        public string Title { get; set; } = string.Empty;

        [BsonElement("description")]
        public string Description { get; set; } = string.Empty;

        [BsonElement("ownerId")]
        public string OwnerId { get; set; } = string.Empty;

        [BsonElement("members")]
        public List<string> Members { get; set; } = new List<string>();
    }
}