package content

type Content interface {
	Categories(classcode string) ([]string, error)
	NamesToCats(classcode string) (map[string]string, error)
}
