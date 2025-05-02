#!/bin/bash

# ✅ Step 1: Scale NodeGroup back to desired nodes (e.g., 2 nodes)

# Replace these with your real cluster and node group name 👇
CLUSTER_NAME="YOUR_CLUSTER_NAME"
NODEGROUP_NAME="YOUR_NODEGROUP_NAME"

echo "Scaling Node Group ($NODEGROUP_NAME) back to 2 nodes..."
aws eks update-nodegroup-config \
  --cluster-name $CLUSTER_NAME \
  --nodegroup-name $NODEGROUP_NAME \
  --scaling-config minSize=1,maxSize=2,desiredSize=2

echo "⏳ Waiting 2 minutes for nodes to come online..."
sleep 120

# ✅ Step 2: Recreate LoadBalancer services

echo "Recreating frontend LoadBalancer..."
kubectl apply -f frontend-service.yaml

echo "Recreating backend LoadBalancer..."
kubectl apply -f backend-service.yaml

echo "✅ AWS cluster resumed and LoadBalancers recreated!"
