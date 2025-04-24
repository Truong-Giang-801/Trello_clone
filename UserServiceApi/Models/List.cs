using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace UserServiceApi.Models
{
    public class List
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("title")]
        public string Title { get; set; } = string.Empty;

        [BsonElement("boardId")]
        public string BoardId { get; set; } = string.Empty;

        [BsonElement("position")]
        public int Position { get; set; } = 0;
    }
}