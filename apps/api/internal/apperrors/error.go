package apperrors

type Error struct {
	ErrCode string
	Message string
	Err     error `json:"-"`
}

func (e *Error) Error() string {
	return e.Message
}

func (e *Error) Unwrap() error {
	return e.Err
}
