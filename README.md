
<h1 align="center" style="font-size:60px;">
🌌 FANTASY <br>
</h1>
<h3 align="center">
  Real-Time Crypto Dashboard + AI Trading Bot <br>
⚡ Live Prices • 📈 Charts • 🤖 AI Predictions • 💳 Razorpay Top-Up • 💼 Internal Wallet Trading
</h3>



🚀 **What is Fantasy?**
<p mggin-left-40px>
  Fantasy is a modern crypto trading platform where users can:
  
  * ⚡ View **real-time crypto prices** (1 sec updates)
  * 📊 Analyze **candlestick charts**
  * 🤖 Use **AI predictions** (5-minute & 1-hour)
  * 🎮 Practice **paper trading** with virtual money
  * 🔔 Receive **alerts** & bot notifications
  * 💼 Trade using an **internal wallet**
  * 💳 Add money using **Razorpay** (ONLY for top-up)
</p>

🏗️ **System Architecture Overview**

  Fantasy follows a clean, scalable, microservice architecture:
  
  * ☸️ **Kubernetes** orchestrates services
  * 🐳 **Docker** runs containers
  * 🟩 **Postgres** stores all core data
  * 🟥 **Redis** handles caching & real-time updates
  * 🟧 **S3** stores ML models, files, logs
  * 🐍 **Python** runs AI + trading bot
  * 🟩 **Node.js** powers the API and wallet
  * 🌐 **Cloudflare + NGINX** handle traffic
  * 💳 **Razorpay** handles top-up payments
  * 🔁 **CI/CD with GitHub + Jenkins** for deployments


🌐 **Architecture Diagram**

<img width="2341" height="1152" alt="image" src="https://github.com/user-attachments/assets/b2a9b9ff-cbdf-481d-b774-9664bfbb4353" />


📘 **Architecture Legend (Simple & Clear)**

  ☸️ **Kubernetes (K8s)**
  
    * Runs & scales all backend services
    * Does health checks (readiness/liveness)
    * Restarts unhealthy pods
    * Uses Secrets & ConfigMaps for config
    * Manages Docker-based Node.js and Python services


  🐳 **Docker (Container Runtime)**

    * Each service runs as its own container:
    
      * Node.js API
      * Python AI engine
      * Worker jobs
      * Market data collectors


  🟩 **Postgres (Main Database)**

    Stores:
    
    * Users
    * Wallet balances
    * Ledger (credit, debit, reserve, release)
    * Trades & orders
    * AI signals
    * Razorpay payment logs
    
    Recommended: **AWS RDS Postgres**
    K8s apps connect to it securely.


  🟥 **Redis (Cache + Real-Time Pub/Sub)**

    Used for:
    
    * Live price broadcasting
    * Bot queues
    * Rate limiting
    * Fast caching
    * User sessions
    

  🟧 **AWS S3**

    Stores:
    
    * ML model files
    * Market data snapshots
    * User images
    * Log files
    * Backups


  🐍 **Python Service**

    Handles:
    
    * Market data collector
    * Data analysis & candle generation
    * AI prediction models (LSTM, XGBoost, Prophet)
    * Auto trading bot engine
    * Background jobs
    
    Communicates with Redis, Postgres, S3.


  🟩 **Node.js Service (Main Backend API)**

    Handles:
    
    * Authentication
    * Authorization
    * Wallet + Ledger
    * Trade placement
    * Notifications
    * Razorpay webhook + top-up flow
    
    Talks to Postgres, Redis, S3.


🕸️ **NGINX (Reverse Proxy)**

    * Receives traffic from Cloudflare
    * Routes to Node.js API
    * Handles WebSocket upgrades
    * Acts as load balancer
    

🌐 **Cloudflare (CDN + Security Layer)**

    * CDN caching
    * Rate limiting
    * SSL termination
    * DDoS protection
    * DNS management


💳 **Razorpay**

    * User → Razorpay Checkout
    * Razorpay → Webhook → Node.js
    * Node.js → Postgres → Credit wallet
    
    Trading uses **internal Fantasy Ledger** only.


🔁 **CI/CD — GitHub + Jenkins**

    * Code pushed → GitHub
    * Jenkins pulls code → builds Docker images
    * Images deployed to Kubernetes cluster on AWS EC2
    * Automated, safe, and version-controlled
    

🙌 **Maintainer**

  INDRESH VIKRAM

