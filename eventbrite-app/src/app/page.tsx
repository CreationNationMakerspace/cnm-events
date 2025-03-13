"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';
import Image from "next/image";

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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-6 pb-20 gap-16 sm:p-20 bg-[url('/backdrop.jpg')] bg-cover bg-center bg-fixed">
      <div className="absolute inset-0 bg-white/50"></div>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start relative">
      <div>
        <div className="flex flex-col items-center mb-8">
          <a href="https://creationnation.ca/" target="_blank" rel="noopener noreferrer" className="relative w-[400px] h-[130px] block">
            <Image
              src="/cnm.svg"
              alt="CNM Logo"
              fill
              priority
              className="mb-4 object-contain"
            />
          </a>
          <h1 className="text-4xl font-bold text-gray-800 text-center sm:text-left font-sans drop-shadow-[0_3px_3px_rgba(0,0,0,0.4)]">Upcoming Events</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div 
              key={event.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-3 font-sans">
                  <a href={event.url} className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                    {event.name.text}
                  </a>
                </h2>
                <div className="space-y-3">
                  <p className="flex items-center text-gray-700 font-sans">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {(() => {
                      const eventDate = new Date(event.start.local);
                      const today = new Date();
                      const tomorrow = new Date(today);
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      
                      eventDate.setHours(0, 0, 0, 0);
                      today.setHours(0, 0, 0, 0);
                      tomorrow.setHours(0, 0, 0, 0);
                      
                      if (eventDate.getTime() === today.getTime()) {
                        return <span className="text-green-600 font-medium">Tonight</span>;
                      } else if (eventDate.getTime() === tomorrow.getTime()) {
                        return <span className="text-blue-600 font-medium">Tomorrow</span>;
                      }
                      return eventDate.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      });
                    })()}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 font-sans">Capacity</p>
                      <p className="font-semibold text-gray-500 font-sans text-center">{event.ticket_classes ? event.ticket_classes.reduce((acc: number, ticket: TicketClass) => acc + (ticket.capacity ?? 0), 0) : 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 font-sans">Tickets Sold</p>
                      <p className="font-semibold text-gray-700 font-sans text-center">{event.ticket_classes ? event.ticket_classes.reduce((acc: number, ticket: TicketClass) => acc + (ticket.quantity_sold ?? 0), 0) : 0}</p>
                    </div>
                  </div>
                  {event.ticket_classes && event.ticket_classes.reduce((acc: number, ticket: TicketClass) => acc + (ticket.capacity ?? 0), 0) === event.ticket_classes.reduce((acc: number, ticket: TicketClass) => acc + (ticket.quantity_sold ?? 0), 0) ? (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg">
                      <p className="text-red-600 font-semibold text-center font-sans">SOLD OUT</p>
                    </div>
                  ) : (
                    <a 
                      href={event.url} 
                      className="mt-4 block p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200 cursor-pointer"
                    >
                      <p className="text-green-600 font-semibold text-center font-sans">
                        {event.ticket_classes ? event.ticket_classes.reduce((acc: number, ticket: TicketClass) => acc + (ticket.capacity ?? 0), 0) - event.ticket_classes.reduce((acc: number, ticket: TicketClass) => acc + (ticket.quantity_sold ?? 0), 0) : 0} Tickets Available
                      </p>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </main>
    </div>
  );
};

export default HomePage;
