require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const connectDB = require("./db/connect");
const notFondMiddleware = require("./middleware/not-found");
const globalErrHandler = require("./middleware/error-handler");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");

// Security Packages
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1);
app.use(
  rateLimiter.rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  })
);

// Configure Helmet to allow inline scripts/styles needed for API docs (like docgen)
// By default, Helmet blocks inline scripts which breaks expand/collapse in static HTML docs
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true, // Use Helmet's default CSP settings
      directives: {
        // Allow scripts from self, inline scripts (needed for docgen interactivity), and external CDNs
        "script-src": ["'self'", "'unsafe-inline'", "https:"],
        // Allow images from self, inline base64 (data URIs), and external CDNs
        "img-src": ["'self'", "data:", "https:"],
        // Allow inline styles (used in static docs) and stylesheets from external CDNs
        "style-src": ["'self'", "'unsafe-inline'", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);
app.use(xss());
// app.use(
//   mongoSanitize({
//     allowDots: true,
//     replaceWith: '_',
//   })
// );

// middleware
app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"));
app.use(
  fileUpload({
    createParentPath: true,
  })
);

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);
app.get("/api-docs", (req, res) => {
  res.removeHeader("Content-Security-Policy");
  res.sendFile(__dirname+'/public/api-docs.html')
});

app.get("/", (req, res) => {
  res.sendFile(__dirname+'/public/index.html')
});

app.use(notFondMiddleware);
app.use(globalErrHandler);

const start = async () => {
  try {
    // conntt db
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`Server listening at port: ${PORT}...`));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
start();
