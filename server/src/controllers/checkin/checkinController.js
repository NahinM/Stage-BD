import * as reservationModel from "../../models/reservations/reservation.js";

export const verifyCheckIn = async (req, res) => {
    const { qr_code_string } = req.body;
    try {
        const reservation = await reservationModel.getReservationByQR(qr_code_string);
        
        if (!reservation || reservation.status !== 'confirmed') {
            return res.status(400).json({ valid: false, message: "Invalid or cancelled ticket." });
        }
        if (reservation.is_checked_in) {
            return res.status(400).json({ valid: false, message: "Ticket has already been checked in!" });
        }

        const checkedIn = await reservationModel.confirmCheckIn(qr_code_string);
        res.status(200).json({ valid: true, message: "Check-in successful", data: checkedIn });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const getDashboardStats = async (req, res) => {
    const { eventId } = req.params;
    try {
        const reservations = await reservationModel.getReservationsByEvent(eventId);
        const confirmed = reservations.filter(r => r.status === 'confirmed');
        const checkedInCount = confirmed.filter(r => r.is_checked_in).length;
        const totalCount = confirmed.length;

        res.status(200).json({ 
            total_expected: totalCount,
            checked_in: checkedInCount,
            pending: totalCount - checkedInCount,
            list: confirmed
        });
    } catch (err) {
         res.status(500).json({ error: err.message });
    }
}
