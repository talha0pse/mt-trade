#!/bin/bash

echo "🚀 Applying backend deployment and service..."
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml

echo "🚀 Applying frontend deployment and service..."
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml

echo "⏳ Waiting 60 seconds for LoadBalancers to get external IPs..."
sleep 60

echo "🔗 Fetching service URLs:"
kubectl get svc frontend-service backend-service
echo ""
echo "✅ Done. Copy 'EXTERNAL-IP' values above and open them in browser!"
