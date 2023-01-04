package content

type Content interface {
	Categories(classcode string) ([]string, error)
	NamesToCats(classcode string, prefix string) (map[string]string, error)
}
