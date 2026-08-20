FROM golang:1.25.5-bookworm AS build

WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY cmd ./cmd
COPY internal ./internal

ARG TARGETOS=linux
ARG TARGETARCH
RUN CGO_ENABLED=0 GOOS=${TARGETOS} GOARCH=${TARGETARCH} \
	go build -tags lambda.norpc -o /out/main ./cmd/lambda/api

FROM public.ecr.aws/lambda/provided:al2023

COPY --from=build /out/main ${LAMBDA_TASK_ROOT}/main

ENTRYPOINT [ "/var/task/main" ]
