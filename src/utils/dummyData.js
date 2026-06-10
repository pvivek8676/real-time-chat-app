export const users = [
  {
    id: 1,
    name: "Rahul Sharma",
    online: true,
    lastMessage: "Hello bro",
  },
  {
    id: 2,
    name: "Amit Verma",
    online: true,
    lastMessage: "Let's meet tomorrow",
  },
  {
    id: 3,
    name: "Priya Singh",
    online: false,
    lastMessage: "Good Night",
  },
];

export const userChats = {
  1: [
    {
      id: 1,
      text: "Hello 👋",
      own: false,
      time: "10:30 AM",
    },
    {
      id: 2,
      text: "Hi Rahul",
      own: true,
      time: "10:31 AM",
    },
  ],

  2: [
    {
      id: 3,
      text: "Project complete?",
      own: false,
      time: "11:00 AM",
    },
  ],

  3: [
    {
      id: 4,
      text: "Good Night 🌙",
      own: false,
      time: "09:45 PM",
    },
  ],
};