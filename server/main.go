package main

import (
	"context"
	"encoding/json"
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
	port            = flag.Int("port", 50051, "The server port")
	vapidEmail      = "kumarshishir248@gmail.com"
	vapidPublicKey  = "BG9lF97uafdJ_A9vVXpM3iJx_BGnCKQVy0LdAtTIrI_9KhIXiFHYYhvDimWsTt2pzSxE0jbmc17LskZrilTv4ZI"
	vapidPrivateKey = "9Ym-7WhhSCbmpZpKrr_i829qysLZnIFC7efp3jb4noo"
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

	payload := `{"title": "My notification title","body": "My notification body"}`

	// Send a push notification to the client
	status, err := webpush.SendNotification([]byte(payload), subscription, &webpush.Options{
		Subscriber:      vapidEmail,
		VAPIDPublicKey:  vapidPublicKey,
		VAPIDPrivateKey: vapidPrivateKey,
		TTL:             30,
	})
	if err != nil {
		return nil, err
	}
	log.Println(status.Status)
	return &pb.Response{Message: "Push notification sent"}, nil
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
