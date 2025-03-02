import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ 
    id: "nxt-ai",
    name:"Nxt Ai", 
    credentials: {
        gemini: {
          apiKey: "AIzaSyDzKpRb4uPVINaxsfOEgK7CQUQnF2w1Rqw",
        },
      },
});
