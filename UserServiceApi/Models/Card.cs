using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace UserServiceApi.Models
{
    public class Card
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("title")]
        public string Title { get; set; } = string.Empty;

        [BsonElement("position")]
        public int Position { get; set; } = 0;

        [BsonElement("listId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string ListId { get; set; } = string.Empty;

        [BsonElement("dueDate")]
        public DateTime DueDate { get; set; } = DateTime.UtcNow;

        [BsonElement("assignMember")]
        public List<string> AssignMember { get; set; } = new List<string>();
    }
}