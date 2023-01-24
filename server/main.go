package main

import (
	"context"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"log"
	"net"
	"net/http"

	webpush "github.com/SherClockHolmes/webpush-go"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	pb "github.com/shishir248/SymbolNotification/files/go"
	"google.golang.org/grpc"
)

var (
	port = flag.Int("port", 50051, "The server port")
)

var (
	vapidPublicKey  = "YOUR_PUBLIC_VAPID_KEY"
	vapidPrivateKey = "YOUR_PRIVATE_VAPID_KEY"
	vapidEmail      = "example@yourdomain.org"
)

// server is used to implement helloworld.GreeterServer.
type server struct {
	pb.UnimplementedPushNotificationServer
}

func (s *server) Subscribe(ctx context.Context, in *pb.SubscribeRequest) (*pb.Response, error) {
	// Extract the subscription from the request message
	var subscription *webpush.Subscription
	if err := json.Unmarshal([]byte(in.GetSubscription()), &subscription); err != nil {
		return nil, err
	}

	// Send a push notification to the client
	_, err := webpush.SendNotification([]byte("Hello World"), subscription, &webpush.Options{
		Subscriber:      "example@example.com",
		VAPIDPublicKey:  "YOUR_PUBLIC_VAPID_KEY",
		VAPIDPrivateKey: "YOUR_PRIVATE_VAPID_KEY",
	})
	if err != nil {
		return nil, err
	}
	return &pb.Response{Message: "Push notification sent"}, nil
}

func (s *server) SendNotification(ctx context.Context, in *pb.Notification) (*pb.Response, error) {
	if in.GetAccess() {
		subscription := in.GetSubscription()
		payload := []byte(`{"title":"Push test", "body":"Hello World", "icon":"icon.png"}`) // Send push notification

		_, err := webpush.SendNotification(payload, subscription, &webpush.Options{
			Subscriber:      vapidEmail,
			VAPIDPublicKey:  vapidPublicKey,
			VAPIDPrivateKey: vapidPrivateKey,
		})
		if err != nil {
			log.Printf("Error sending push notification: %v", err)
			return nil, err
		}

		return &pb.Response{Message: "Hello World"}, nil
	}
	log.Fatalf("Access Denied")
	return nil, errors.New("Access Denied")
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
