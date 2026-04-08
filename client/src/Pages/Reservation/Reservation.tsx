import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { requestReservation, joinWaitlist, cancelReservation } from './api.ts';
import { Ticket, CheckCircle, AlertCircle } from 'lucide-react';

export default function Reservation() {
  const [username, setUsername] = useState('');
  const [eventId, setEventId] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isWaitlisted, setIsWaitlisted] = useState(false);
  const [reservationData, setReservationData] = useState<any>(null);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setIsWaitlisted(false);
    
    try {
        const response = await requestReservation({
            username, 
            event_id: Number(eventId), 
            promo_code: promoCode || undefined 
        });
        setReservationData(response.reservation);
    } catch (err: any) {
        if (err.response?.data?.waitlistAvailable) {
            setIsWaitlisted(true);
            setError("Event is full. You can join the waitlist.");
        } else {
            setError(err.response?.data?.error || "An error occurred.");
        }
    } finally {
        setLoading(false);
    }
  };

  const handleWaitlist = async () => {
    setLoading(true);
    try {
        await joinWaitlist({ username, event_id: Number(eventId) });
        setError(null);
        alert("You've been added to the waitlist!");
    } catch (err: any) {
        setError(err.response?.data?.error || "Error joining waitlist");
    } finally {
        setLoading(false);
    }
  }

  const handleCancel = async () => {
       if (!reservationData) return;
       if (confirm("Are you sure you want to cancel your reservation?")) {
           try {
               await cancelReservation(reservationData.reservation_id, Number(eventId));
               setReservationData(null);
               alert("Reservation cancelled successfully.");
           } catch(err: any) {
               alert("Failed to cancel.");
           }
       }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 px-6 py-8 text-center text-white">
            <Ticket className="mx-auto h-12 w-12 mb-4" />
            <h2 className="text-3xl font-bold">Reserve Your Ticket</h2>
            <p className="mt-2 text-blue-100">Secure your spot at the next big event!</p>
        </div>

        <div className="p-8">
          {!reservationData ? (
             <form onSubmit={handleBook} className="space-y-6">
                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start">
                       <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                       <p className="text-sm">{error}</p>
                    </div>
                )}
                
                <div>
                   <label className="block text-sm font-medium text-gray-700">Username</label>
                   <input required type="text" value={username} onChange={e => setUsername(e.target.value)}
                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                
                <div>
                   <label className="block text-sm font-medium text-gray-700">Event ID</label>
                   <input required type="number" value={eventId} onChange={e => setEventId(Number(e.target.value))}
                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700">Promo Code (Optional)</label>
                   <input type="text" value={promoCode} onChange={e => setPromoCode(e.target.value)} placeholder="e.g. EARLYBIRD20"
                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>

                <div className="flex flex-col space-y-3 pt-4">
                    <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                       {loading ? 'Processing...' : 'Book Ticket'}
                    </button>
                    {isWaitlisted && (
                        <button type="button" onClick={handleWaitlist} disabled={loading} className="w-full flex justify-center py-3 px-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50">
                           Join Waitlist
                        </button>
                    )}
                </div>
             </form>
          ) : (
             <div className="text-center">
                 <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                 <h3 className="text-2xl font-bold text-gray-900 mb-2">Reservation Confirmed!</h3>
                 <p className="text-gray-500 mb-6">Your unique QR Code is generated below. Please present it at the check-in desk.</p>
                 
                 <div className="bg-gray-100 p-6 rounded-xl inline-block mb-6 shadow-inner">
                    <QRCode value={reservationData.qr_code_string} size={200} />
                 </div>

                 <div className="grid grid-cols-2 gap-4 text-left border-t border-b py-4 mb-6">
                    <div>
                       <span className="block text-xs uppercase text-gray-500 font-semibold">Seat Number</span>
                       <span className="block text-lg font-bold text-gray-900">{reservationData.seat_number}</span>
                    </div>
                    <div>
                       <span className="block text-xs uppercase text-gray-500 font-semibold">Res. Code</span>
                       <span className="block text-lg font-bold tracking-widest text-gray-900">{reservationData.reservation_code}</span>
                    </div>
                 </div>

                 <button onClick={handleCancel} className="text-sm text-red-600 font-medium hover:text-red-800 hover:underline">
                    Cancel my reservation
                 </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
