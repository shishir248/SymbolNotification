package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net"
	"net/http"

	"github.com/improbable-eng/grpc-web/go/grpcweb"
	pb "github.com/shishir248/SymbolNotification/files/go"
	"google.golang.org/grpc"
)

var (
	port = flag.Int("port", 50051, "The server port")
)

// server is used to implement helloworld.GreeterServer.
type server struct {
	pb.UnimplementedPushNotificationServer
}

func (s *server) GetAccess(ctx context.Context, in *pb.Emp) (*pb.Subscription, error) {
	log.Printf("Received: %v", in.GetAccess())
	return &pb.Subscription{access: in.GetAccess()}, nil
}

func (s *server) SendNotification(ctx context.Context, in *pb.Notification) (*pb.Response, error) {
	subscription, err := s.GetAccess(ctx, &pb.Access{})
	return &pb.Response{Message: "Hello World"}, nil
}

func main() {
	flag.Parse()
	lis, err := net.Listen("tcp", fmt.Sprintf("localhost:%d", *port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterPushNotificationServer(s, &server{})
	log.Printf("grpc server listening at %v", lis.Addr())
	go func() {
		log.Fatalf("failed to serve: %v", s.Serve(lis))
	}()

	// gRPC web code
	grpcWebServer := grpcweb.WrapServer(
		s,
		// Enable CORS
		grpcweb.WithOriginFunc(func(origin string) bool { return true }),
	)

	srv := &http.Server{
		Handler: grpcWebServer,
		Addr:    fmt.Sprintf("localhost:%d", *port+1),
	}

	log.Printf("http server listening at %v", srv.Addr)
	if err := srv.ListenAndServe(); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
