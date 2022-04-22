docker buildx build -t typrone1/ticket-svc . --platform linux/amd64
docker push typrone1/ticket-svc

docker buildx build -t typrone1/auth-svc . --platform linux/amd64
docker push typrone1/auth-svc

docker buildx build -t typrone1/expiration-svc . --platform linux/amd64
docker push typrone1/expiration-svc

docker buildx build -t typrone1/frontend .

docker buildx build -t typrone1/frontend . --platform linux/amd64

docker run -d typrone1/frontend:latest
docker push typrone1/frontend

docker buildx build -t typrone1/orders-svc . --platform linux/amd64
docker push typrone1/orders-svc


docker buildx build -t typrone1/payment-svc . --platform linux/amd64
docker push typrone1/payment-svc

docker push typrone1/ticket-svc
docker push typrone1/payment-svc
docker push typrone1/orders-svc
docker push typrone1/expiration-svc
docker push typrone1/ticket-svc
docker push typrone1/auth-svc

const axios = require('axios').default;
axios.get('http://192.168.77.160:8080/api/users/currentuser').then(function (response) {console.log(response);})
axios.get('http://a482a497403784e66a2a70a77561dd1c-1139531466.ap-southeast-1.elb.amazonaws.com/api/users/currentuser').then(function (response) {console.log(response);})


brew install kubeseal
wget https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.12.1/controller.yaml
kubectl apply -f controller.yaml

https://enlear.academy/sealed-secrets-with-kubernetes-a3f4d13dbc17

https://medium.com/@HoussemDellai/rbac-with-kubernetes-in-minikube-4deed658ea7b

https://medium.com/codex/setup-istio-ingress-traffic-management-on-minikube-725c5e6d767a

https://istio.io/latest/docs/setup/getting-started/