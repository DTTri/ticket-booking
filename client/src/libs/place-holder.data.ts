import Event from "@/models/Event";

export const sampleEvents: Event[] = [
  {
    Guid: "1a2b3c4d5e6f7g8h9i0j",
    Name: "Music Festival 2025",
    Description: "A grand music festival featuring top artists from around the world.",
    StartDateTime: "2025-05-01T18:00:00Z",
    EndDateTime: "2025-05-01T23:00:00Z",
    Status: "Active",
    Image:
      "https://images.unsplash.com/photo-1558465202-92356bf74344?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    VenueId: "venue123",
    OrganizerUserId: "user456",
    CreatedAt: "2025-04-01T10:00:00Z",
    UpdatedAt: "2025-04-10T12:00:00Z",
  },
  {
    Guid: "2b3c4d5e6f7g8h9i0j1a",
    Name: "Tech Conference 2025",
    Description: "An annual conference showcasing the latest in technology and innovation.",
    StartDateTime: "2025-06-15T09:00:00Z",
    EndDateTime: "2025-06-15T17:00:00Z",
    Image:
      "https://images.unsplash.com/photo-1558465202-92356bf74344?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Status: "Active",
    VenueId: "venue456",
    OrganizerUserId: "user789",
    CreatedAt: "2025-03-20T14:00:00Z",
    UpdatedAt: "2025-04-05T16:00:00Z",
  },
  {
    Guid: "3c4d5e6f7g8h9i0j1a2b",
    Name: "Art Exhibition 2025",
    Description: "A showcase of contemporary art from renowned artists.",
    StartDateTime: "2025-07-10T10:00:00Z",
    EndDateTime: "2025-07-20T18:00:00Z",
    Image:
      "https://images.unsplash.com/photo-1558465202-92356bf74344?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Status: "Upcoming",
    VenueId: "venue789",
    OrganizerUserId: "user123",
    CreatedAt: "2025-02-15T09:00:00Z",
    UpdatedAt: "2025-03-01T11:00:00Z",
  },
  {
    Guid: "4d5e6f7g8h9i0j1a2b3c",
    Name: "Food Carnival 2025",
    Description: "A celebration of food and culture with cuisines from around the globe.",
    StartDateTime: "2025-08-05T12:00:00Z",
    EndDateTime: "2025-08-05T22:00:00Z",
    Status: "Active",
    Image:
      "https://images.unsplash.com/photo-1558465202-92356bf74344?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    VenueId: "venue321",
    OrganizerUserId: "user654",
    CreatedAt: "2025-04-05T08:00:00Z",
    UpdatedAt: "2025-04-12T10:00:00Z",
  },
  {
    Guid: "5e6f7g8h9i0j1a2b3c4d",
    Name: "Charity Run 2025",
    Description: "A charity run event to raise funds for local communities.",
    StartDateTime: "2025-09-10T06:00:00Z",
    EndDateTime: "2025-09-10T12:00:00Z",
    Image:
      "https://images.unsplash.com/photo-1558465202-92356bf74344?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Status: "Upcoming",
    VenueId: "venue654",
    OrganizerUserId: "user987",
    CreatedAt: "2025-01-10T07:00:00Z",
    UpdatedAt: "2025-02-20T09:00:00Z",
  },
];
