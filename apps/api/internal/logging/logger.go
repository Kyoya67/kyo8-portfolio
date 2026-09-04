package logging

import (
	"log/slog"
	"os"
)

var Default = slog.New(slog.NewJSONHandler(os.Stdout, nil))
