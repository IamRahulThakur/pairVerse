import express from 'express';
import  AdminAuth  from './middlewares/auth.js';

const app = express();

app.use("/admin", AdminAuth);

app.get("/admin/data" ,(req, res) => {
  try {
    // Simulating some admin data retrieval logic
    throw new Error('Simulated error for testing');
    console.log('Admin data retrieved successfully');
    res.json({ message: 'Admin data retrieved successfully' });
  } 
  catch (error) {
    console.error('Error retrieving admin data:', error);
    res.status(500).send('Internal Server Error'); 
  }
});

// Wild card route for error handling
app.use("/" , (err, req, res, next) => {
  if(err) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  }
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});