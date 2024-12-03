const express=require('express');
const schoolSchema=require('./utils/validation');
const db=require('./utils/db');
const app=express();
const dotenv=require('dotenv');
dotenv.config();
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('server is running');
});

// Add School API
app.post('/addSchool', (req, res) => {
    const { error } = schoolSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { name, address, latitude, longitude } = req.body;

    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    db.query(query, [name, address, latitude, longitude], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'School added successfully', schoolId: result.insertId });
    });
});

// List Schools API
app.get('/listSchools', (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const userLat = parseFloat(latitude);
    const userLng = parseFloat(longitude);

    const query = 'SELECT id, name, address, latitude, longitude FROM schools';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }

        const schools = results.map((school) => {
            const distance = Math.sqrt(
                Math.pow(userLat - school.latitude, 2) +
                Math.pow(userLng - school.longitude, 2)
            );
            return { ...school, distance };
        });

        schools.sort((a, b) => a.distance - b.distance);

        res.json(schools);
    });
});

// Start Server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});



