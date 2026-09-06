package handler

import (
	"io"
	"log/slog"
	"os"
	"testing"

	"github.com/Kyoya67/kyo8-portfolio/apps/api/internal/logging"
)

func TestMain(m *testing.M) {
	original := logging.Default
	logging.Default = slog.New(slog.NewTextHandler(io.Discard, nil))

	code := m.Run()

	logging.Default = original
	os.Exit(code)
}
