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
axios.get('http://istio-ingressgateway.istio-system.svc.cluster.local/api/users/currentuser').then(function (response) {console.log(response);})
axios.get('http://a482a497403784e66a2a70a77561dd1c-1139531466.ap-southeast-1.elb.amazonaws.com/api/users/currentuser').then(function (response) {console.log(response);})


brew install kubeseal
wget https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.12.1/controller.yaml
kubectl apply -f controller.yaml

https://enlear.academy/sealed-secrets-with-kubernetes-a3f4d13dbc17

https://medium.com/@HoussemDellai/rbac-with-kubernetes-in-minikube-4deed658ea7b

https://medium.com/codex/setup-istio-ingress-traffic-management-on-minikube-725c5e6d767a

https://istio.io/latest/docs/setup/getting-started/

https://blog.sivamuthukumar.com/eks-high-pod-density

https://aws.amazon.com/blogs/containers/backup-and-restore-your-amazon-eks-cluster-resources-using-velero/

BUCKET=ty-eks-backup
REGION=ap-southeast-1
aws s3 mb s3://$BUCKET --region $REGION

cat > velero_policy.json <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeVolumes",
                "ec2:DescribeSnapshots",
                "ec2:CreateTags",
                "ec2:CreateVolume",
                "ec2:CreateSnapshot",
                "ec2:DeleteSnapshot"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:PutObject",
                "s3:AbortMultipartUpload",
                "s3:ListMultipartUploadParts"
            ],
            "Resource": [
                "arn:aws:s3:::${BUCKET}/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::${BUCKET}"
            ]
        }
    ]
}
EOF

aws iam create-policy \ 
    --policy-name VeleroAccessPolicy \
    --policy-document file://velero_policy.json


PRIMARY_CLUSTER=scrumptious-badger-1650604213
RECOVERY_CLUSTER=floral-outfit-1650705250
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)

eksctl create iamserviceaccount --cluster=$PRIMARY_CLUSTER --name=velero-server --namespace=velero --role-name=eks-velero-backup --role-only --attach-policy-arn=arn:aws:iam::$ACCOUNT:policy/VeleroAccessPolicy --approve

eksctl create iamserviceaccount \
--cluster=$RECOVERY_CLUSTER \
--name=velero-server \
--namespace=velero \
--role-name=eks-velero-recovery \
--role-only \
--attach-policy-arn=arn:aws:iam::$ACCOUNT:policy/VeleroAccessPolicy \
--approve

helm repo add vmware-tanzu https://vmware-tanzu.github.io/helm-charts

cat > values.yaml <<EOF
configuration:
  backupStorageLocation:
    bucket: $BUCKET
  provider: aws
  volumeSnapshotLocation:
    config:
      region: $REGION
credentials:
  useSecret: false
initContainers:
- name: velero-plugin-for-aws
  image: velero/velero-plugin-for-aws:v1.2.0
  volumeMounts:
  - mountPath: /target
    name: plugins
serviceAccount:
  server:
    annotations:
      eks.amazonaws.com/role-arn: "arn:aws:iam::${ACCOUNT}:role/eks-velero-backup"
EOF

cat > values_recovery.yaml <<EOF
configuration:
  backupStorageLocation:
    bucket: $BUCKET
  provider: aws
  volumeSnapshotLocation:
    config:
      region: $REGION
credentials:
  useSecret: false
initContainers:
- name: velero-plugin-for-aws
  image: velero/velero-plugin-for-aws:v1.2.0
  volumeMounts:
  - mountPath: /target
    name: plugins
serviceAccount:
  server:
    annotations:
      eks.amazonaws.com/role-arn: "arn:aws:iam::${ACCOUNT}:role/eks-velero-recovery"
EOF

PRIMARY_CONTEXT=tyeks1
RECOVERY_CONTEXT=tyeks2
aws eks --region $REGION update-kubeconfig --name $PRIMARY_CLUSTER --alias $PRIMARY_CONTEXT
aws eks --region $REGION update-kubeconfig --name $RECOVERY_CLUSTER --alias $RECOVERY_CONTEXT

kubectl config use-context $PRIMARY_CONTEXT
helm install velero vmware-tanzu/velero \
    --create-namespace \
    --namespace velero \
    -f values.yaml

kubectl config use-context $RECOVERY_CONTEXT
helm install velero vmware-tanzu/velero \
    --create-namespace \
    --namespace velero \
    -f values_recovery.yaml

kubectl get pods –n velero

helm repo add bitnami https://charts.bitnami.com/bitnami

kubectl config use-context $PRIMARY_CONTEXT
helm install ghost bitnami/ghost \
    --create-namespace \
    --namespace ghost
export APP_HOST=$(kubectl get svc --namespace ghost ghost --template "{{ range (index .status.loadBalancer.ingress 0) }}{{ . }}{{ end }}")
export GHOST_PASSWORD=$(kubectl get secret --namespace "ghost" ghost -o jsonpath="{.data.ghost-password}" | base64 --decode)
export MARIADB_ROOT_PASSWORD=$(kubectl get secret --namespace "ghost" ghost-mariadb -o jsonpath="{.data.mariadb-root-password}" | base64 --decode)
export MARIADB_PASSWORD=$(kubectl get secret --namespace "ghost" ghost-mariadb -o jsonpath="{.data.mariadb-password}" | base64 --decode)

helm upgrade ghost bitnami/ghost \
  --namespace ghost \
  --set service.type=LoadBalancer \
  --set ghostHost=$APP_HOST \
  --set ghostPassword=$GHOST_PASSWORD \
  --set mariadb.auth.rootPassword=$MARIADB_ROOT_PASSWORD \
  --set mariadb.auth.password=$MARIADB_PASSWORD

kubectl get pods –n ghost


velero backup create ghost-backup

velero backup create test -o yaml

velero backup describe ghost-backup

kubectl config use-context $RECOVERY_CONTEXT

velero restore create ghost-restore \
    --from-backup ghost-backup \
    --include-namespaces 

velero restore describe ghost-restore


kubectl -n ghost get svc ghost

