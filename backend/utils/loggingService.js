const AuditLog = require('../models/AuditLog');
const winston = require('winston');
const { createLogger, format, transports } = winston;

// Configure Winston logger
const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'cloth-connect' },
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

// Create audit log
async function createAuditLog(data) {
  try {
    const log = new AuditLog({
      user: data.userId,
      action: data.action,
      category: data.category,
      details: data.details,
      ip: data.ip,
      userAgent: data.userAgent,
      status: data.status,
      metadata: data.metadata,
      errorStack: data.errorStack
    });
    await log.save();
    
    // Also log to Winston if it's an error
    if (data.status === 'ERROR') {
      logger.error({
        message: data.details.message || 'An error occurred',
        ...data
      });
    }
  } catch (error) {
    logger.error('Error creating audit log:', error);
  }
}

// Track API request
async function trackApiRequest(req, res, next) {
  const startTime = Date.now();
  
  // Capture response using response events
  const chunks = [];
  const oldWrite = res.write;
  const oldEnd = res.end;

  res.write = function (chunk) {
    chunks.push(Buffer.from(chunk));
    oldWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk) chunks.push(Buffer.from(chunk));
    const responseBody = Buffer.concat(chunks).toString('utf8');
    const responseTime = Date.now() - startTime;
    
    // Create API request log
    createAuditLog({
      action: 'API_REQUEST',
      category: 'SYSTEM',
      status: res.statusCode >= 400 ? 'ERROR' : 'SUCCESS',
      details: {
        method: req.method,
        path: req.path,
        query: req.query,
        responseTime,
        statusCode: res.statusCode,
        responseSize: responseBody.length
      },
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: req.user?.id,
      metadata: {
        headers: req.headers,
        response: res.statusCode >= 400 ? JSON.parse(responseBody) : undefined
      }
    });

    oldEnd.apply(res, arguments);
  };

  next();
}

// Error logging middleware
function errorLogger(error, req, res, next) {
  createAuditLog({
    action: 'SYSTEM_ERROR',
    category: 'SYSTEM',
    status: 'ERROR',
    details: {
      message: error.message,
      code: error.code,
      type: error.name
    },
    errorStack: error.stack,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: req.user?.id
  });

  logger.error({
    message: error.message,
    stack: error.stack,
    metadata: {
      path: req.path,
      method: req.method,
      userId: req.user?.id
    }
  });

  next(error);
}

// Export logging functions
module.exports = {
  logger,
  createAuditLog,
  trackApiRequest,
  errorLogger
};