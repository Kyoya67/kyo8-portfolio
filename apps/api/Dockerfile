FROM golang:1.25.5-bookworm AS build

WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY cmd ./cmd
COPY internal ./internal

ARG TARGETOS=linux
ARG TARGETARCH
RUN CGO_ENABLED=0 GOOS=${TARGETOS} GOARCH=${TARGETARCH} \
	go build -tags lambda.norpc -o /out/api ./cmd/lambda/api && \
	go build -tags lambda.norpc -o /out/batch ./cmd/lambda/batch

FROM public.ecr.aws/lambda/provided:al2023

COPY --from=build /out/api ${LAMBDA_TASK_ROOT}/api
COPY --from=build /out/batch ${LAMBDA_TASK_ROOT}/batch
COPY entrypoint.sh ${LAMBDA_TASK_ROOT}/entrypoint
RUN chmod +x ${LAMBDA_TASK_ROOT}/entrypoint

ENTRYPOINT [ "/var/task/entrypoint" ]
CMD [ "api" ]
