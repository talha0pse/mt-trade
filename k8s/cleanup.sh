#!/bin/bash

echo "🚩 Deleting all MT Deployments and Services..."
kubectl delete -f delete-all.yaml

echo "⏳ Waiting 30 seconds to ensure AWS Load Balancers get released..."
sleep 30

echo "🔍 Checking remaining services (should be only 'kubernetes' ClusterIP)..."
kubectl get svc

echo "🔍 Checking remaining deployments (should be empty)..."
kubectl get deployments

echo "✅ Cleanup done. Your AWS Load Balancer billing should now stop."
