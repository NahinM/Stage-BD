import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { verifyCheckIn, getDashboardStats } from './api.ts';
import { Users, UserCheck } from 'lucide-react';

export default function Checkin() {
    const [eventId, setEventId] = useState(1);
    const [stats, setStats] = useState<any>(null);
    const [scanResult, setScanResult] = useState<{success: boolean, message: string} | null>(null);

    useEffect(() => {
        let scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: {width: 250, height: 250} }, false);
        
        async function onScanSuccess(decodedText: string) {
            scanner.pause();
            try {
                await verifyCheckIn(decodedText);
                setScanResult({ success: true, message: "Checked in successfully!" });
                fetchStats(); 
            } catch (err: any) {
                setScanResult({ success: false, message: err.response?.data?.message || "Invalid Ticket" });
            }
            setTimeout(() => {
                setScanResult(null);
                scanner.resume();
            }, 3000);
        }

        scanner.render(onScanSuccess, undefined);

        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear scanner. ", error);
            });
        }
    }, [eventId]);

    const fetchStats = async () => {
        try {
            const data = await getDashboardStats(eventId);
            setStats(data);
        } catch (err) {
            console.error("Could not fetch stats");
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 10000); 
        return () => clearInterval(interval);
    }, [eventId]);

    return (
       <div className="min-h-screen bg-slate-900 py-10 px-4">
           <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
               
               <div className="bg-white rounded-2xl shadow-xl p-8">
                   <h2 className="text-2xl font-bold mb-6 text-gray-800">Scan Tickets</h2>
                   <div id="reader" className="w-full overflow-hidden rounded-xl border-2 border-gray-100"></div>
                   
                   {scanResult && (
                       <div className={`mt-6 p-4 rounded-xl text-center font-bold text-lg ${scanResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                           {scanResult.message}
                       </div>
                   )}
               </div>

               <div className="space-y-6">
                   <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Event Dashboard</h2>
                            <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                                <span className="text-sm text-gray-500 font-medium">Event:</span>
                                <input type="number" value={eventId} onChange={e => setEventId(Number(e.target.value))} className="bg-transparent w-12 outline-none font-bold text-gray-800" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl flex items-center">
                                <div className="bg-blue-500 p-3 rounded-lg mr-4">
                                   <Users className="text-white h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-blue-600 font-semibold uppercase">Total Expected</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats?.total_expected || 0}</p>
                                </div>
                            </div>

                            <div className="bg-green-50 border border-green-100 p-6 rounded-xl flex items-center">
                                <div className="bg-green-500 p-3 rounded-lg mr-4">
                                   <UserCheck className="text-white h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-green-600 font-semibold uppercase">Checked In</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats?.checked_in || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 border-t pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-800">Recent Attendance</h3>
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded">Live</span>
                            </div>
                            <ul className="space-y-3 max-h-64 overflow-y-auto">
                                {stats?.list?.map((res: any) => (
                                    <li key={res.reservation_id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <div className={`h-3 w-3 rounded-full ${res.is_checked_in ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                            <span className="font-medium text-gray-800">{res.username}</span>
                                        </div>
                                        <div className="text-sm text-gray-500 font-mono">{res.seat_number}</div>
                                    </li>
                                ))}
                                {!stats?.list?.length && <p className="text-gray-500 italic text-sm">No reservations yet.</p>}
                            </ul>
                        </div>
                   </div>
               </div>

           </div>
       </div>
    );
}
