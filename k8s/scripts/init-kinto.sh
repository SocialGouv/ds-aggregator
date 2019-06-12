#!/bin/sh

INIT_KINTO_POD_STATUS=$(kubectl get job ds-aggregator-init-kinto"$1")

# Check if ds-aggregator-init-kinto job exists
if [ ! "$INIT_KINTO_POD_STATUS" ]
then
    kubectl apply -f k8s/kinto/job-init-kinto-ds-aggregator.yml
else
    kubectl delete job ds-aggregator-init-kinto"$1"
    kubectl apply -f k8s/kinto/job-init-kinto-ds-aggregator.yml
fi

