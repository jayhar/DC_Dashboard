import express from 'express';
import urlMonitorRoutes from './routes/urlMonitorRoutes.js';
import './scheduler.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Static files
app.use(express.static('views'));

// Routes
app.use('/api/urls', urlMonitorRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

