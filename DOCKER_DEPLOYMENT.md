# Docker Deployment Guide

This guide explains how to build, run, and deploy the dockerized Property Listing API.

## Local Development

1. **Build and Run with Docker Compose**
   ```bash
   # Build and start all services
   docker-compose up --build

   # Run in detached mode
   docker-compose up -d

   # Stop all services
   docker-compose down
   ```

2. **View Logs**
   ```bash
   # View all logs
   docker-compose logs

   # View app logs
   docker-compose logs app

   # Follow logs
   docker-compose logs -f
   ```

## Production Deployment

### Option 1: Deploy on a VPS (e.g., DigitalOcean, AWS EC2)

1. **Set Up VPS**
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh

   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone your-repository-url
   cd your-repository

   # Create .env file
   nano .env
   # Add your environment variables

   # Build and start
   docker-compose up -d --build
   ```

3. **Set Up Nginx (Optional)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Option 2: Deploy on Cloud Platforms

#### AWS Elastic Beanstalk

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB Application**
   ```bash
   eb init
   ```

3. **Create Environment**
   ```bash
   eb create production
   ```

4. **Deploy**
   ```bash
   eb deploy
   ```

#### Google Cloud Run

1. **Install Google Cloud SDK**

2. **Build and Push Container**
   ```bash
   # Build container
   docker build -t gcr.io/your-project-id/property-listing-api .

   # Push to Google Container Registry
   docker push gcr.io/your-project-id/property-listing-api
   ```

3. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy property-listing-api \
     --image gcr.io/your-project-id/property-listing-api \
     --platform managed \
     --region your-region \
     --allow-unauthenticated
   ```

## Environment Variables

For production, set these environment variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

## Security Considerations

1. **Use Secrets Management**
   - Use Docker secrets or cloud platform secrets management
   - Never commit sensitive data to version control

2. **Network Security**
   - Expose only necessary ports
   - Use internal Docker network for service communication
   - Set up proper firewall rules

3. **Database Security**
   - Use strong passwords
   - Enable authentication
   - Restrict network access

## Monitoring

1. **Container Health**
   ```bash
   # Check container status
   docker ps

   # View container logs
   docker logs container_id
   ```

2. **Resource Usage**
   ```bash
   # Monitor resource usage
   docker stats
   ```

## Backup and Recovery

1. **Database Backup**
   ```bash
   # Backup MongoDB data
   docker exec mongodb mongodump --out /backup

   # Restore from backup
   docker exec mongodb mongorestore /backup
   ```

2. **Volume Backup**
   ```bash
   # Backup volumes
   docker run --rm -v mongodb_data:/source -v $(pwd):/backup alpine tar -czf /backup/mongodb_backup.tar.gz -C /source .
   ```

## Troubleshooting

1. **Container Issues**
   ```bash
   # Check container logs
   docker logs container_id

   # Restart container
   docker-compose restart app
   ```

2. **Database Issues**
   ```bash
   # Check MongoDB logs
   docker-compose logs mongodb

   # Access MongoDB shell
   docker-compose exec mongodb mongosh
   ```

## Support

- Docker Documentation: [https://docs.docker.com](https://docs.docker.com)
- Docker Compose Documentation: [https://docs.docker.com/compose](https://docs.docker.com/compose)
- MongoDB Documentation: [https://docs.mongodb.com](https://docs.mongodb.com) 