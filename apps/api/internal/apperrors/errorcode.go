package apperrors

type ErrCode string

const (
	Unknown ErrCode = "U000"

	BadParam             ErrCode = "R001"
	ReqBodyDecodeFailed  ErrCode = "R002"
	ResponseEncodeFailed ErrCode = "R003"

	DependencyUnavailable ErrCode = "D001"
	DependencyAuthFailed  ErrCode = "D002"
	DependencyConfigError ErrCode = "D003"
	DependencyThrottled   ErrCode = "D004"
	Timeout               ErrCode = "D005"
)

func (code ErrCode) Wrap(err error, message string) error {
	return &Error{ErrCode: string(code), Message: message, Err: err}
}
