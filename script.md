docker build -t typrone1/ticket-svc .
docker push typrone1/ticket-svc

docker build -t typrone1/auth-svc .
docker push typrone1/auth-svc

docker build -t typrone1/expiration-svc .
docker push typrone1/expiration-svc

docker build -t typrone1/frontend .
docker run -d typrone1/frontend:latest
docker push typrone1/frontend

docker build -t typrone1/orders-svc .
docker push typrone1/orders-svc


docker build -t typrone1/payment-svc .
docker push typrone1/payment-svc



brew install kubeseal
wget https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.12.1/controller.yaml
kubectl apply -f controller.yaml

https://enlear.academy/sealed-secrets-with-kubernetes-a3f4d13dbc17

https://medium.com/@HoussemDellai/rbac-with-kubernetes-in-minikube-4deed658ea7b

https://medium.com/codex/setup-istio-ingress-traffic-management-on-minikube-725c5e6d767a

https://istio.io/latest/docs/setup/getting-started/