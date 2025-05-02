Here’s the **README.txt** with all the necessary steps. This will be helpful to quickly resume or restart the app without needing to remember each individual command.

---

### 📄 `README.txt`

# MT Copy Trading App - Kubernetes Setup Guide

## 1. Prerequisites

Before you start, ensure you have the following:

* AWS credentials set up and configured
* `kubectl` installed and connected to your Kubernetes cluster
* `aws` CLI installed for AWS interactions
* YAML files for deployments, services, and cleanup

## 2. Setup & Deployment

Use the provided scripts and YAMLs to deploy the backend and frontend in your Kubernetes cluster.

### 2.1. Apply Deployment & Service YAMLs

To deploy the backend and frontend, apply the corresponding YAML files:

```bash
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
```

### 2.2. Expose Services

Both backend and frontend services will automatically be exposed via **LoadBalancer** type.
You can check the external IP addresses by running:

```bash
kubectl get svc frontend-service backend-service
```

This will return something like:

```
NAME               TYPE           CLUSTER-IP       EXTERNAL-IP                                                               PORT(S)        AGE
backend-service    LoadBalancer   10.100.38.233    a1b2c3d4.elb.amazonaws.com                                                80:31284/TCP   1m
frontend-service   LoadBalancer   10.100.168.199   a4b5c6d7.elb.amazonaws.com                                                80:31851/TCP   1m
```

Use the **EXTERNAL-IP** to access your app in the browser.

---

## 3. Start All Services Script

### 3.1. Run the start script

To deploy both services and fetch the LoadBalancer URLs in one go, use the following script:

```bash
chmod +x start-all.sh
./start-all.sh
```

It will:

* Deploy backend and frontend
* Wait 60 seconds for the LoadBalancer IPs to be assigned
* Show you the **EXTERNAL-IP** URLs to open in your browser.

---

## 4. Clean-up Script

### 4.1. Running the Cleanup

When you're done or want to remove the deployed resources, run the `cleanup.sh` script to delete the Kubernetes deployments, services, and any other associated resources:

```bash
chmod +x cleanup.sh
./cleanup.sh
```

This will remove the frontend, backend, and any associated LoadBalancers.

---

## 5. Monitoring Logs (Optional)

To view logs for any running pod, use the following command:

```bash
kubectl logs <pod-name>
```

Replace `<pod-name>` with the name of your running pod (you can get it from `kubectl get pods`).

---

## 6. Cost Control (AWS)

Remember, if you're not using the services and need to avoid AWS costs, consider deleting the entire cluster:

```bash
aws eks delete-cluster --name <your-cluster-name>
```

---

### 💡 Notes:

* Make sure to adjust any file paths or environment variables for your specific project needs.
* If you face any errors during the process, check pod statuses using `kubectl describe pods` or `kubectl logs`.

---

This README will help you get your Kubernetes cluster set up, deploy your services, and clean up resources when needed. Let me know if you need further clarifications or updates to the guide!
