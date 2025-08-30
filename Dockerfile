# Dockerfile for USG-LEGO
# Supports linux/amd64 and linux/arm64

# Build stage for backend (Go)
FROM --platform=$BUILDPLATFORM golang:1.21-alpine AS backend-builder

# Install build dependencies
RUN apk add --no-cache git

WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the binary
RUN CGO_ENABLED=0 GOOS=${TARGETOS} GOARCH=${TARGETARCH} \
    go build -a -installsuffix cgo -o /go/bin/usg-lego ./cmd/server

# Final stage - create a minimal image
FROM alpine:latest

# Install ca-certificates for HTTPS requests
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the binary from the builder stage
COPY --from=backend-builder /go/bin/usg-lego .

# Copy web assets
COPY --from=backend-builder /app/web/dist ./web/dist

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/health || exit 1

# Run the binary
ENTRYPOINT ["./usg-lego"]