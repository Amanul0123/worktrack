const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const env = require('./config/env');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Allow multiple origins: local dev + deployed frontend
const allowedOrigins = env.clientUrl
  ? env.clientUrl.split(',').map((o) => o.trim())
  : [];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Render health checks, mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/me', require('./routes/user.routes'));
app.use('/api/tasks', require('./routes/task.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/activity', require('./routes/activity.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

module.exports = app;
