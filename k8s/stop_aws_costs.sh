#!/bin/bash

# ✅ Step 1: Delete LoadBalancer services
echo "Deleting LoadBalancers (frontend and backend)..."
kubectl delete svc frontend-service
kubectl delete svc backend-service

# ✅ Step 2: Scale NodeGroup to Zero

# Replace these with your real cluster and node group name 👇
CLUSTER_NAME="YOUR_CLUSTER_NAME"
NODEGROUP_NAME="YOUR_NODEGROUP_NAME"

echo "Scaling Node Group ($NODEGROUP_NAME) to zero nodes..."
aws eks update-nodegroup-config \
  --cluster-name $CLUSTER_NAME \
  --nodegroup-name $NODEGROUP_NAME \
  --scaling-config minSize=0,maxSize=0,desiredSize=0

# ✅ Step 3: Delete any Persistent Volumes (optional)
echo "Deleting any PersistentVolumes..."
kubectl delete pvc --all
kubectl delete pv --all

echo "✅ AWS cost-stopping actions completed!"
