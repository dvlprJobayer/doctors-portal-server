const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const router = express.Router();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5bvzh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const appointmentCollection = client.db("doctors-portal").collection("all-appointment");
        const bookingCollection = client.db("doctors-portal").collection("booking");
        const userCollection = client.db("doctors-portal").collection("users");

        // Insert Booking
        router.post('/booking', async (req, res) => {
            const booking = req.body;
            const filter = { treatment: booking.treatment, patient: booking.patient, date: booking.date }
            const exist = await bookingCollection.findOne(filter);
            if (exist) {
                return res.status(406).send({ success: false, booking: exist });
            }
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        });

        // Insert User
        // router.put('/user/:email', async)

        // Available appointment
        router.get('/available', async (req, res) => {
            const { date } = req.query;
            const query = { date };
            const services = await appointmentCollection.find().toArray();
            const bookings = await bookingCollection.find(query).toArray();
            services.forEach(service => {
                const serviceBookings = bookings.filter(book => book.treatment === service.name);
                const bookedSlots = serviceBookings.map(booked => booked.slot);
                service.slots = service.slots.filter(slot => !bookedSlots.includes(slot));
            });
            res.send(services);
        });

        // User Specific appointment
        router.get('/my-appointment', async (req, res) => {
            const { date, email } = req.query;
            const filter = { date, patient: email };
            const result = await bookingCollection.find(filter).toArray();
            res.send(result);
        });
    }
    finally { }
}
run().catch(console.dir);

// Test Api
router.get('/', (req, res) => {
    res.send('Running Doctors Portal server');
});

module.exports = router;