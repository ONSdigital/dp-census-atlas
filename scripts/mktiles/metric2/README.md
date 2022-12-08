Some of the file generation tests write to a temporary directory and then
compare the contents of that directory with a reference directory under
testdata/.

The temporary directories are removed after each test, so if a test fails
it can be hard to figure out why.

If you set TEST_KEEP_TMP to any string, the names of the temporary directories
will be printed and won't be removed.

For example, to run the breaks tests and keep the output files:

	TEST_KEEP_TMP=1 go test ./ -run Test_MakeBreaks
