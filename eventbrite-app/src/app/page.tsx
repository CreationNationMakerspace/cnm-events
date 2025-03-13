"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';
// import Image from "next/image";

type TicketClass = {
  quantity_sold: number;
  capacity: number;
};

type Event = {
  id: string;
  url: string;
  name: { text: string };
  start: { local: string };
  capacity: number;
  ticket_classes: TicketClass[];
};

const HomePage = () => {
  const [events, setEvents] = useState<Event[]>([]);

  console.log('Eventbrite API Token:', process.env.NEXT_PUBLIC_EVENTBRITE_API_TOKEN);
  console.log('Eventbrite Org ID:', process.env.NEXT_PUBLIC_EVENTBRITE_ORG_ID);
  console.log('API URL:', `https://www.eventbriteapi.com/v3/organizations/${process.env.NEXT_PUBLIC_EVENTBRITE_ORG_ID}/events/?status=live&order_by=start_asc`);

  const fetchTicketInfo = async (eventId: string) => {
    try {
      const response = await axios.get(`https://www.eventbriteapi.com/v3/events/${eventId}/ticket_classes/`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_EVENTBRITE_API_TOKEN}`,
        },
      });
      return response.data.ticket_classes;
    } catch (error) {
      console.error('Error fetching ticket information:', error);
      return [];
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`https://www.eventbriteapi.com/v3/organizations/${process.env.NEXT_PUBLIC_EVENTBRITE_ORG_ID}/events/?status=live&order_by=start_asc`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_EVENTBRITE_API_TOKEN}`,
        },
      });
      const eventsWithTickets = await Promise.all(response.data.events.map(async (event: Event) => {
        const ticketClasses = await fetchTicketInfo(event.id);
        return { ...event, ticket_classes: ticketClasses };
      }));
      setEvents(eventsWithTickets);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <div>
        <h1>Upcoming Events</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {events.map((event) => (
            <div key={event.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px', width: '300px' }}>
              <h2><a href={event.url}>{event.name.text}</a></h2>
              <p>Date: {new Date(event.start.local).toLocaleDateString()}</p>
              <p>Capacity: {event.ticket_classes ? event.ticket_classes.reduce((acc: number, ticket: TicketClass) => acc + (ticket.capacity ?? 0), 0) : 'N/A'}</p>
              <p>Tickets Sold: {event.ticket_classes ? event.ticket_classes.reduce((acc: number, ticket: TicketClass) => acc + (ticket.quantity_sold ?? 0), 0) : 0}</p>
              {event.ticket_classes && event.ticket_classes.reduce((acc: number, ticket: TicketClass) => acc + (ticket.capacity ?? 0), 0) === event.ticket_classes.reduce((acc: number, ticket: TicketClass) => acc + (ticket.quantity_sold ?? 0), 0) ? (
                <p className="text-red-500 font-bold">SOLD OUT</p>
              ) : (
                <p>Available Tickets: {event.ticket_classes ? event.ticket_classes.reduce((acc: number, ticket: TicketClass) => acc + (ticket.capacity ?? 0), 0) - event.ticket_classes.reduce((acc: number, ticket: TicketClass) => acc + (ticket.quantity_sold ?? 0), 0) : 0}</p>
              )}
            </div>
          ))}
        </div>
      </div>
      </main>
      
      
    </div>
  );
};

export default HomePage;
